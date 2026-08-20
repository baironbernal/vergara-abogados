<?php

namespace App\Livewire;

use App\Models\Citation;
use App\Models\Lawyer;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Livewire\Attributes\Computed;
use Livewire\Component;

/**
 * Multi-step consultation booking — replaces Components/Shared/Form/MultiStep.jsx
 * (ContactForm + Calendar + confirmation) and the two JSON endpoints
 * contact.save-partial / contact.complete-reservation.
 *
 * Notable changes, all deliberate:
 *  - The FullCalendar week grid is now rendered server-side as plain buttons, so
 *    the fullcalendar npm packages can be dropped at cutover (MIGRATION.md §8.4).
 *  - Slot availability is decided on the server. React only checked for clashes
 *    in the browser, which a crafted request could bypass.
 *  - Zod's rules (observations min 10, privacy policy accepted) were browser-only;
 *    they are now server rules, so they can no longer be skipped (§11).
 */
class ContactForm extends Component
{
    /** Livewire actions bypass the route's `throttle:10,1`, so it is applied here (§8.3). */
    private const MAX_ATTEMPTS = 10;

    private const DECAY_SECONDS = 60;

    private const DAY_START = 9;   // 09:00

    private const DAY_END = 18;    // 18:00

    private const SLOT_MINUTES = 30;

    public int $step = 1;

    // Step 1 — personal details
    public string $name = '';

    public string $email = '';

    public string $phone = '';

    public string $lawyer_id = '';

    public string $observations = '';

    public bool $agree = false;

    // Step 2 — slot picking
    public ?int $citationId = null;

    public string $weekStart = '';

    public string $selectedStart = '';

    public string $selectedEnd = '';

    // Step 3 — confirmation summary (kept after the fields are reset)
    public array $summary = [];

    public function mount(): void
    {
        $this->weekStart = $this->startOfCurrentWeek()->toDateString();
    }

    protected function rules(): array
    {
        return [
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|email|max:255',
            'phone' => ['required', 'string', 'max:50', 'regex:/^\+?[0-9\s-]{7,15}$/'],
            'lawyer_id' => 'required|string',
            'observations' => 'required|string|min:10|max:2000',
            'agree' => 'accepted',
        ];
    }

    protected function messages(): array
    {
        return [
            'name.required' => 'Tu nombre es obligatorio',
            'name.min' => 'Tu nombre es muy corto',
            'email.required' => 'El correo es obligatorio',
            'email.email' => 'Correo inválido',
            'phone.required' => 'El teléfono es obligatorio',
            'phone.regex' => 'Teléfono inválido',
            'lawyer_id.required' => 'Selecciona un abogado',
            'observations.required' => 'Cuéntanos tu situación',
            'observations.min' => 'Cuéntanos un poco más (mín. 10 caracteres)',
            'agree.accepted' => 'Debes aceptar la política de privacidad',
        ];
    }

    /** Step 1 → 2. Saves the partial citation, exactly like contact.save-partial did. */
    public function saveAndContinue(): void
    {
        $this->rateLimit();

        $validated = $this->validate();

        $lawyerId = null;
        if ($validated['lawyer_id'] !== 'cualquiera') {
            if (! Lawyer::whereKey($validated['lawyer_id'])->exists()) {
                throw ValidationException::withMessages([
                    'lawyer_id' => 'El abogado seleccionado no existe',
                ]);
            }
            $lawyerId = (int) $validated['lawyer_id'];
        }

        $citation = Citation::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'lawyer_id' => $lawyerId,
            'observations' => $validated['observations'],
            'starts_at' => null,
            'ends_at' => null,
        ]);

        // Bind the citation to this session so completeReservation cannot be
        // pointed at somebody else's record (the IDOR guard from the controller).
        session(['pending_citation_id' => $citation->id]);

        $this->citationId = $citation->id;
        $this->step = 2;
    }

    public function back(): void
    {
        $this->step = 1;
        $this->clearSlot();
    }

    public function previousWeek(): void
    {
        $candidate = Carbon::parse($this->weekStart)->subWeek();

        // Never navigate to a week that is entirely in the past.
        if ($candidate->lt($this->startOfCurrentWeek())) {
            return;
        }

        $this->weekStart = $candidate->toDateString();
        $this->clearSlot();
    }

    public function nextWeek(): void
    {
        $this->weekStart = Carbon::parse($this->weekStart)->addWeek()->toDateString();
        $this->clearSlot();
    }

    public function selectSlot(string $start): void
    {
        $slotStart = Carbon::parse($start);
        $slotEnd = $slotStart->copy()->addMinutes(self::SLOT_MINUTES);

        if (! $this->slotIsBookable($slotStart, $slotEnd)) {
            throw ValidationException::withMessages([
                'selectedStart' => 'Este horario no está disponible. Por favor seleccione otro.',
            ]);
        }

        $this->selectedStart = $slotStart->toDateTimeString();
        $this->selectedEnd = $slotEnd->toDateTimeString();
    }

    public function clearSlot(): void
    {
        $this->selectedStart = '';
        $this->selectedEnd = '';
        $this->resetValidation();
    }

    /** Step 2 → 3. Mirrors contact.complete-reservation, session guard included. */
    public function confirmReservation(): void
    {
        $this->rateLimit();

        if ($this->selectedStart === '') {
            throw ValidationException::withMessages([
                'selectedStart' => 'Selecciona un horario para continuar',
            ]);
        }

        $pendingId = session('pending_citation_id');
        if (! $pendingId || (int) $pendingId !== (int) $this->citationId) {
            abort(403, 'No autorizado para modificar esta cita.');
        }

        $slotStart = Carbon::parse($this->selectedStart);
        $slotEnd = Carbon::parse($this->selectedEnd);

        // Re-check on submit: the slot may have been taken while the user decided.
        if (! $this->slotIsBookable($slotStart, $slotEnd)) {
            $this->clearSlot();

            throw ValidationException::withMessages([
                'selectedStart' => 'Ese horario acaba de ser reservado. Por favor seleccione otro.',
            ]);
        }

        $citation = Citation::findOrFail($this->citationId);
        $citation->update([
            'starts_at' => $slotStart,
            'ends_at' => $slotEnd,
        ]);

        // One-time use — clear the session binding.
        session()->forget('pending_citation_id');

        $this->summary = [
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'observations' => $this->observations,
            'lawyer' => $this->lawyer_id === 'cualquiera'
                ? 'Cualquiera'
                : Lawyer::whereKey($this->lawyer_id)->value('name'),
            'starts_at' => $slotStart->translatedFormat('l j \d\e F \d\e Y, g:i a'),
            'ends_at' => $slotEnd->format('g:i a'),
        ];

        $this->reset(['name', 'email', 'phone', 'lawyer_id', 'observations', 'agree']);
        $this->step = 3;
    }

    /** Citations that block a slot in the visible week, honouring the lawyer choice. */
    #[Computed]
    public function busySlots(): Collection
    {
        $weekStart = Carbon::parse($this->weekStart)->startOfDay();
        $weekEnd = $weekStart->copy()->addDays(5)->endOfDay();

        return Citation::query()
            ->whereNotNull('starts_at')
            ->whereNotNull('ends_at')
            ->where('starts_at', '<', $weekEnd)
            ->where('ends_at', '>', $weekStart)
            // "cualquiera" must avoid every booked slot; a named lawyer only theirs.
            ->when($this->lawyer_id !== '' && $this->lawyer_id !== 'cualquiera',
                fn ($q) => $q->where('lawyer_id', (int) $this->lawyer_id))
            ->with('lawyer:id,name')
            ->get(['id', 'lawyer_id', 'starts_at', 'ends_at', 'blocked_by_user']);
    }

    /** The week grid: 5 weekdays x 30-minute slots between 09:00 and 18:00. */
    #[Computed]
    public function weekGrid(): array
    {
        $weekStart = Carbon::parse($this->weekStart)->startOfDay();
        $busy = $this->busySlots();
        $now = now();

        $days = [];

        foreach (range(0, 4) as $dayOffset) {
            $day = $weekStart->copy()->addDays($dayOffset);
            $slots = [];

            for ($hour = self::DAY_START; $hour < self::DAY_END; $hour++) {
                foreach ([0, self::SLOT_MINUTES] as $minute) {
                    $start = $day->copy()->setTime($hour, $minute);
                    $end = $start->copy()->addMinutes(self::SLOT_MINUTES);

                    $clash = $busy->first(fn ($c) => $start->lt($c->ends_at) && $end->gt($c->starts_at));

                    $slots[] = [
                        'start' => $start->toDateTimeString(),
                        'label' => $start->format('g:i a'),
                        'past' => $start->lte($now),
                        'blocked' => (bool) $clash?->blocked_by_user,
                        'occupied' => $clash !== null && ! $clash->blocked_by_user,
                        'lawyer' => $clash?->lawyer?->name,
                        'selected' => $this->selectedStart === $start->toDateTimeString(),
                    ];
                }
            }

            $days[] = [
                'label' => $day->translatedFormat('D j'),
                'full' => $day->translatedFormat('l j \d\e F'),
                'slots' => $slots,
            ];
        }

        return $days;
    }

    public function canGoToPreviousWeek(): bool
    {
        return Carbon::parse($this->weekStart)->gt($this->startOfCurrentWeek());
    }

    private function slotIsBookable(Carbon $start, Carbon $end): bool
    {
        if ($start->lte(now())) {
            return false;
        }

        // Weekdays only, inside business hours, aligned to the slot grid.
        if ($start->isWeekend()
            || $start->hour < self::DAY_START
            || $end->hour > self::DAY_END
            || ($end->hour === self::DAY_END && $end->minute > 0)
            || ! in_array($start->minute, [0, self::SLOT_MINUTES], true)) {
            return false;
        }

        return ! $this->busySlots()
            ->contains(fn ($c) => $start->lt($c->ends_at) && $end->gt($c->starts_at));
    }

    private function startOfCurrentWeek(): Carbon
    {
        return now()->startOfWeek(Carbon::MONDAY)->startOfDay();
    }

    private function rateLimit(): void
    {
        $key = 'contact-form:'.request()->ip();

        if (RateLimiter::tooManyAttempts($key, self::MAX_ATTEMPTS)) {
            throw ValidationException::withMessages([
                'name' => 'Demasiadas solicitudes. Intenta de nuevo en '
                    .RateLimiter::availableIn($key).' segundos.',
            ]);
        }

        RateLimiter::hit($key, self::DECAY_SECONDS);
    }

    public function render()
    {
        return view('livewire.contact-form', [
            'lawyers' => Lawyer::orderBy('name')->get(['id', 'name', 'profession']),
        ]);
    }
}

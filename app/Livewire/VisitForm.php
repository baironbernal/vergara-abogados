<?php

namespace App\Livewire;

use App\Models\Property;
use App\Models\Visit;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Livewire\Component;

/**
 * Visit scheduling modal — replaces Components/Properties/VisitForm.jsx and the
 * JSON endpoint at VisitController@store.
 *
 * Validation rules are copied from that controller and are now the single source
 * of truth (the duplicated client-side checks in React are gone).
 */
class VisitForm extends Component
{
    /**
     * Livewire actions do not pass through the HTTP `throttle:10,1` middleware
     * that protected POST /inmobiliaria/visits, so the same budget is enforced
     * here by hand. See MIGRATION.md §8.3/§8.4.
     */
    private const MAX_ATTEMPTS = 10;

    private const DECAY_SECONDS = 60;

    public Property $property;

    public bool $open = false;

    public bool $submitted = false;

    public string $name = '';

    public string $email = '';

    public string $phone = '';

    public string $visit_date = '';

    public string $visit_time = '';

    public string $observations = '';

    /** Kept to show the booked slot on the confirmation screen after reset. */
    public string $confirmedDate = '';

    public string $confirmedTime = '';

    protected function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'visit_date' => 'required|date|after_or_equal:today',
            'visit_time' => 'required|date_format:H:i',
            'observations' => 'nullable|string|max:1000',
        ];
    }

    protected function validationAttributes(): array
    {
        return [
            'name' => 'nombre',
            'email' => 'correo electrónico',
            'phone' => 'teléfono',
            'visit_date' => 'fecha',
            'visit_time' => 'hora',
            'observations' => 'observaciones',
        ];
    }

    public function openForm(): void
    {
        $this->open = true;
    }

    public function closeForm(): void
    {
        $this->open = false;
        $this->submitted = false;
        $this->resetValidation();
    }

    public function submit(): void
    {
        $this->rateLimit();

        $validated = $this->validate();

        // The date rule only guarantees "today or later"; combined with the time
        // the slot must still be in the future, matching VisitController@store.
        if (strtotime($this->visit_date.' '.$this->visit_time) <= time()) {
            throw ValidationException::withMessages([
                'visit_date' => 'La fecha y hora de la visita deben ser futuras',
            ]);
        }

        try {
            Visit::create($validated + ['property_id' => $this->property->id]);
        } catch (\Throwable $e) {
            Log::error('Error creating visit', ['exception' => $e]);

            throw ValidationException::withMessages([
                'name' => 'Error interno del servidor. Por favor intente nuevamente.',
            ]);
        }

        $this->confirmedDate = $this->visit_date;
        $this->confirmedTime = $this->visit_time;

        $this->reset(['name', 'email', 'phone', 'visit_date', 'visit_time', 'observations']);
        $this->submitted = true;
    }

    private function rateLimit(): void
    {
        $key = 'visit-form:'.request()->ip();

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
        return view('livewire.visit-form');
    }
}

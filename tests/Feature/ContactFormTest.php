<?php

namespace Tests\Feature;

use App\Livewire\ContactForm;
use App\Models\Citation;
use App\Models\Lawyer;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Covers the Livewire replacement for MultiStep.jsx + ContactForm.jsx + Calendar.jsx
 * and the contact.save-partial / contact.complete-reservation endpoints.
 */
class ContactFormTest extends TestCase
{
    use RefreshDatabase;

    private Lawyer $lawyer;

    protected function setUp(): void
    {
        parent::setUp();

        // A fixed Tuesday 08:00 keeps "this week" and slot arithmetic predictable.
        Carbon::setTestNow(Carbon::parse('2026-09-01 08:00:00'));

        $this->lawyer = Lawyer::create([
            'name' => 'Bryan Vergara',
            'slug' => 'bryan-vergara',
            'profession' => 'Abogado',
            'phone' => '3001234567',
            'email' => 'bryan@example.com',
        ]);

        RateLimiter::clear('contact-form:127.0.0.1');
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function step1(array $overrides = [])
    {
        $data = array_merge([
            'name' => 'Ana Pérez',
            'email' => 'ana@example.com',
            'phone' => '+57 300 123 4567',
            'lawyer_id' => (string) $this->lawyer->id,
            'observations' => 'Necesito asesoría para comprar un apartamento',
            'agree' => true,
        ], $overrides);

        $component = Livewire::test(ContactForm::class);

        foreach ($data as $field => $value) {
            $component->set($field, $value);
        }

        return $component;
    }

    /** A free weekday slot inside business hours, in the current week. */
    private function freeSlot(): string
    {
        return Carbon::parse('2026-09-01 14:00:00')->toDateTimeString();
    }

    public function test_the_contact_page_renders_the_form(): void
    {
        $this->get('/contacto')
            ->assertOk()
            ->assertSee('Escribe tu Mensaje')
            ->assertSee('Información Personal')
            ->assertSee('Bryan Vergara');
    }

    public function test_step_one_creates_a_partial_citation_and_advances(): void
    {
        $this->step1()
            ->call('saveAndContinue')
            ->assertHasNoErrors()
            ->assertSet('step', 2);

        $citation = Citation::first();

        $this->assertNotNull($citation);
        $this->assertSame('ana@example.com', $citation->email);
        $this->assertSame($this->lawyer->id, $citation->lawyer_id);
        $this->assertNull($citation->starts_at, 'The partial record must not have a slot yet');
    }

    public function test_choosing_cualquiera_stores_a_null_lawyer(): void
    {
        $this->step1(['lawyer_id' => 'cualquiera'])
            ->call('saveAndContinue')
            ->assertHasNoErrors();

        $this->assertNull(Citation::first()->lawyer_id);
    }

    public function test_step_one_validates_required_fields(): void
    {
        Livewire::test(ContactForm::class)
            ->call('saveAndContinue')
            ->assertHasErrors(['name', 'email', 'phone', 'lawyer_id', 'observations', 'agree'])
            ->assertSet('step', 1);

        $this->assertDatabaseCount('citations', 0);
    }

    public function test_the_privacy_policy_must_be_accepted(): void
    {
        // Zod enforced this in the browser only; it is now a server rule.
        $this->step1(['agree' => false])
            ->call('saveAndContinue')
            ->assertHasErrors(['agree']);

        $this->assertDatabaseCount('citations', 0);
    }

    public function test_observations_must_be_at_least_ten_characters(): void
    {
        $this->step1(['observations' => 'corto'])
            ->call('saveAndContinue')
            ->assertHasErrors(['observations']);
    }

    public function test_an_invalid_phone_is_rejected(): void
    {
        $this->step1(['phone' => 'no-es-telefono'])
            ->call('saveAndContinue')
            ->assertHasErrors(['phone']);
    }

    public function test_an_unknown_lawyer_is_rejected(): void
    {
        $this->step1(['lawyer_id' => '99999'])
            ->call('saveAndContinue')
            ->assertHasErrors(['lawyer_id']);
    }

    public function test_the_full_flow_books_the_slot(): void
    {
        $component = $this->step1()->call('saveAndContinue');

        $component->call('selectSlot', $this->freeSlot())
            ->assertHasNoErrors()
            ->assertSet('selectedStart', $this->freeSlot())
            ->call('confirmReservation')
            ->assertHasNoErrors()
            ->assertSet('step', 3);

        $citation = Citation::first();

        $this->assertSame($this->freeSlot(), $citation->starts_at->toDateTimeString());
        $this->assertSame('2026-09-01 14:30:00', $citation->ends_at->toDateTimeString());
    }

    public function test_the_confirmation_summary_survives_the_form_reset(): void
    {
        $component = $this->step1()
            ->call('saveAndContinue')
            ->call('selectSlot', $this->freeSlot())
            ->call('confirmReservation');

        $component->assertSet('name', '')
            ->assertSee('Ana Pérez')
            ->assertSee('Bryan Vergara');
    }

    public function test_a_slot_in_the_past_cannot_be_selected(): void
    {
        $this->step1()
            ->call('saveAndContinue')
            ->call('selectSlot', '2026-08-31 10:00:00')
            ->assertHasErrors(['selectedStart']);
    }

    public function test_a_slot_outside_business_hours_cannot_be_selected(): void
    {
        $this->step1()
            ->call('saveAndContinue')
            ->call('selectSlot', '2026-09-01 20:00:00')
            ->assertHasErrors(['selectedStart']);
    }

    public function test_a_weekend_slot_cannot_be_selected(): void
    {
        // 2026-09-05 is a Saturday.
        $this->step1()
            ->call('saveAndContinue')
            ->call('selectSlot', '2026-09-05 10:00:00')
            ->assertHasErrors(['selectedStart']);
    }

    public function test_an_already_booked_slot_cannot_be_selected(): void
    {
        Citation::create([
            'name' => 'Otro cliente',
            'email' => 'otro@example.com',
            'phone' => '3001112222',
            'lawyer_id' => $this->lawyer->id,
            'starts_at' => $this->freeSlot(),
            'ends_at' => '2026-09-01 14:30:00',
        ]);

        $this->step1()
            ->call('saveAndContinue')
            ->call('selectSlot', $this->freeSlot())
            ->assertHasErrors(['selectedStart']);
    }

    public function test_a_slot_taken_after_selection_is_rejected_on_confirm(): void
    {
        $component = $this->step1()
            ->call('saveAndContinue')
            ->call('selectSlot', $this->freeSlot())
            ->assertHasNoErrors();

        // Someone else books the same slot before confirmation.
        Citation::create([
            'name' => 'Otro cliente',
            'email' => 'otro@example.com',
            'phone' => '3001112222',
            'lawyer_id' => $this->lawyer->id,
            'starts_at' => $this->freeSlot(),
            'ends_at' => '2026-09-01 14:30:00',
        ]);

        $component->call('confirmReservation')
            ->assertHasErrors(['selectedStart'])
            ->assertSet('step', 2)
            ->assertSet('selectedStart', '');
    }

    public function test_confirming_without_a_slot_shows_an_error(): void
    {
        $this->step1()
            ->call('saveAndContinue')
            ->call('confirmReservation')
            ->assertHasErrors(['selectedStart'])
            ->assertSet('step', 2);
    }

    public function test_the_previous_week_button_cannot_go_before_this_week(): void
    {
        $component = $this->step1()->call('saveAndContinue');

        $currentWeek = $component->get('weekStart');

        $component->call('previousWeek')->assertSet('weekStart', $currentWeek);

        $component->call('nextWeek')
            ->call('previousWeek')
            ->assertSet('weekStart', $currentWeek);
    }

    public function test_going_back_returns_to_step_one_and_clears_the_slot(): void
    {
        $this->step1()
            ->call('saveAndContinue')
            ->call('selectSlot', $this->freeSlot())
            ->call('back')
            ->assertSet('step', 1)
            ->assertSet('selectedStart', '');
    }

    public function test_submissions_are_rate_limited_like_the_old_throttle_middleware(): void
    {
        foreach (range(1, 10) as $i) {
            $this->step1(['email' => "user{$i}@example.com"])
                ->call('saveAndContinue')
                ->assertHasNoErrors();
        }

        $this->assertDatabaseCount('citations', 10);

        $this->step1(['email' => 'blocked@example.com'])
            ->call('saveAndContinue')
            ->assertHasErrors(['name']);

        $this->assertDatabaseCount('citations', 10);
    }
}

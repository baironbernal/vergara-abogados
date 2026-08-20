<?php

namespace Tests\Feature;

use App\Livewire\VisitForm;
use App\Models\Municipality;
use App\Models\Property;
use App\Models\State;
use App\Models\Visit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Covers the Livewire replacement for Components/Properties/VisitForm.jsx and
 * the POST /inmobiliaria/visits endpoint, including the rate limit that the
 * HTTP `throttle:10,1` middleware used to provide.
 */
class VisitFormTest extends TestCase
{
    use RefreshDatabase;

    private Property $property;

    protected function setUp(): void
    {
        parent::setUp();

        $state = State::create(['name' => 'Cundinamarca']);
        $municipality = Municipality::create(['name' => 'Soacha', 'state_id' => $state->id]);

        $this->property = Property::create([
            'name' => 'Casa de prueba',
            'type' => 'house',
            'price' => 300_000_000,
            'size' => 120,
            'description' => 'Una casa',
            'state_id' => $state->id,
            'municipality_id' => $municipality->id,
        ]);

        RateLimiter::clear('visit-form:127.0.0.1');
    }

    private function visitForm()
    {
        return Livewire::test(VisitForm::class, ['property' => $this->property]);
    }

    private function validPayload(): array
    {
        return [
            'name' => 'Ana Pérez',
            'email' => 'ana@example.com',
            'phone' => '+57 300 123 4567',
            'visit_date' => now()->addDays(3)->toDateString(),
            'visit_time' => '10:30',
            'observations' => 'Quisiera ver el patio',
        ];
    }

    private function fill($component, array $overrides = [])
    {
        foreach (array_merge($this->validPayload(), $overrides) as $field => $value) {
            $component->set($field, $value);
        }

        return $component;
    }

    public function test_the_detail_page_renders_and_mounts_the_form(): void
    {
        $this->get('/inmobiliaria/'.$this->property->id)
            ->assertOk()
            ->assertSee('Casa de prueba')
            ->assertSee('Agendar Visita')
            ->assertSee('Volver a Propiedades');
    }

    public function test_a_valid_submission_creates_a_visit(): void
    {
        $this->fill($this->visitForm())
            ->call('submit')
            ->assertHasNoErrors()
            ->assertSet('submitted', true);

        $this->assertDatabaseHas('visits', [
            'name' => 'Ana Pérez',
            'email' => 'ana@example.com',
            'property_id' => $this->property->id,
            'visit_time' => '10:30',
        ]);
    }

    public function test_the_form_resets_but_keeps_the_confirmed_slot(): void
    {
        $component = $this->fill($this->visitForm())->call('submit');

        $component->assertSet('name', '')
            ->assertSet('email', '')
            ->assertSet('confirmedTime', '10:30');
    }

    public function test_required_fields_are_validated(): void
    {
        $this->visitForm()
            ->call('submit')
            ->assertHasErrors(['name', 'email', 'phone', 'visit_date', 'visit_time']);

        $this->assertDatabaseCount('visits', 0);
    }

    public function test_the_email_must_be_valid(): void
    {
        $this->fill($this->visitForm(), ['email' => 'no-es-un-email'])
            ->call('submit')
            ->assertHasErrors(['email']);
    }

    public function test_a_past_date_is_rejected(): void
    {
        $this->fill($this->visitForm(), ['visit_date' => now()->subDay()->toDateString()])
            ->call('submit')
            ->assertHasErrors(['visit_date']);

        $this->assertDatabaseCount('visits', 0);
    }

    public function test_a_time_earlier_today_is_rejected(): void
    {
        $this->fill($this->visitForm(), [
            'visit_date' => now()->toDateString(),
            'visit_time' => '00:01',
        ])->call('submit')->assertHasErrors(['visit_date']);

        $this->assertDatabaseCount('visits', 0);
    }

    public function test_observations_are_length_limited(): void
    {
        $this->fill($this->visitForm(), ['observations' => str_repeat('x', 1001)])
            ->call('submit')
            ->assertHasErrors(['observations']);
    }

    public function test_submissions_are_rate_limited_like_the_old_throttle_middleware(): void
    {
        // The old route was throttle:10,1 — the 11th attempt in a minute fails.
        foreach (range(1, 10) as $i) {
            $this->fill($this->visitForm(), ['email' => "user{$i}@example.com"])
                ->call('submit')
                ->assertHasNoErrors();
        }

        $this->assertDatabaseCount('visits', 10);

        $this->fill($this->visitForm(), ['email' => 'blocked@example.com'])
            ->call('submit')
            ->assertHasErrors(['name']);

        $this->assertDatabaseCount('visits', 10);
        $this->assertNull(Visit::where('email', 'blocked@example.com')->first());
    }

    public function test_closing_the_form_clears_validation_errors(): void
    {
        $this->visitForm()
            ->call('submit')
            ->assertHasErrors(['name'])
            ->call('closeForm')
            ->assertHasNoErrors()
            ->assertSet('open', false);
    }
}

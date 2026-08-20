<?php

namespace Tests\Feature;

use App\Livewire\PropertyCatalog;
use App\Models\Municipality;
use App\Models\Property;
use App\Models\State;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Covers the Livewire replacement for Pages/Properties.jsx. The React page
 * filtered and paginated in the browser over the full dataset; these tests lock
 * in the equivalent server-side behaviour.
 */
class PropertyCatalogTest extends TestCase
{
    use RefreshDatabase;

    private State $cundinamarca;

    private State $antioquia;

    private Municipality $soacha;

    private Municipality $medellin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->cundinamarca = State::create(['name' => 'Cundinamarca']);
        $this->antioquia = State::create(['name' => 'Antioquia']);

        $this->soacha = Municipality::create(['name' => 'Soacha', 'state_id' => $this->cundinamarca->id]);
        $this->medellin = Municipality::create(['name' => 'Medellín', 'state_id' => $this->antioquia->id]);

        // 8 houses in Soacha (page size is 6) priced 100M..800M.
        foreach (range(1, 8) as $i) {
            $this->makeProperty("Casa Soacha {$i}", 'house', $i * 100_000_000, $this->cundinamarca, $this->soacha);
        }

        $this->makeProperty('Apartamento Medellín', 'apartment', 250_000_000, $this->antioquia, $this->medellin);
        $this->makeProperty('Lote Medellín', 'plot', 90_000_000, $this->antioquia, $this->medellin);
    }

    private function makeProperty(string $name, string $type, int $price, State $state, Municipality $municipality): Property
    {
        return Property::create([
            'name' => $name,
            'type' => $type,
            'price' => $price,
            'size' => 100,
            'description' => "Descripción de {$name}",
            'state_id' => $state->id,
            'municipality_id' => $municipality->id,
        ]);
    }

    public function test_the_listing_page_renders_the_first_page(): void
    {
        $this->get('/inmobiliaria')
            ->assertOk()
            ->assertSee('Casa Soacha 1')
            ->assertSee('Filtros de Búsqueda')
            ->assertDontSee('Casa Soacha 7');
    }

    public function test_the_page_query_parameter_selects_the_second_page(): void
    {
        $this->get('/inmobiliaria?page=2')
            ->assertOk()
            ->assertSee('Casa Soacha 7')
            ->assertDontSee('Casa Soacha 1');
    }

    public function test_filtering_by_department_narrows_the_results(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->set('state_id', (string) $this->antioquia->id)
            ->assertSee('Apartamento Medellín')
            ->assertDontSee('Casa Soacha 1');
    }

    public function test_changing_the_department_clears_the_selected_municipality(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->set('state_id', (string) $this->cundinamarca->id)
            ->set('municipality_id', (string) $this->soacha->id)
            ->set('state_id', (string) $this->antioquia->id)
            ->assertSet('municipality_id', '');
    }

    public function test_only_the_selected_departments_municipalities_are_offered(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->set('state_id', (string) $this->antioquia->id)
            ->assertSee('Medellín')
            ->assertDontSee('Soacha');
    }

    public function test_the_price_range_filters_the_results(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->set('minPrice', '150000000')
            ->set('maxPrice', '260000000')
            ->assertSee('Casa Soacha 2')
            ->assertSee('Apartamento Medellín')
            ->assertDontSee('Casa Soacha 1')
            ->assertDontSee('Lote Medellín');
    }

    public function test_the_property_type_filter_uses_spanish_labels(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->assertSee('Apartamento')
            ->assertSee('Casa')
            ->assertSee('Lote')
            ->set('propertyType', 'plot')
            ->assertSee('Lote Medellín')
            ->assertDontSee('Casa Soacha 1');
    }

    public function test_filters_are_read_from_the_query_string(): void
    {
        $this->get('/inmobiliaria?propertyType=apartment')
            ->assertOk()
            ->assertSee('Apartamento Medellín')
            ->assertDontSee('Casa Soacha 1');
    }

    public function test_applying_a_filter_returns_to_the_first_page(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->call('gotoPage', 2)
            ->set('state_id', (string) $this->cundinamarca->id)
            ->assertSee('Casa Soacha 1');
    }

    public function test_no_matches_shows_the_empty_state(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->set('minPrice', '999999999999')
            ->assertSee('No se encontraron propiedades');
    }

    public function test_clearing_filters_restores_the_full_listing(): void
    {
        Livewire::test(PropertyCatalog::class)
            ->set('state_id', (string) $this->antioquia->id)
            ->set('minPrice', '100')
            ->call('clearFilters')
            ->assertSet('state_id', '')
            ->assertSet('minPrice', '')
            ->assertSee('Casa Soacha 1');
    }

    public function test_pagination_links_keep_the_active_filters(): void
    {
        $url = Livewire::test(PropertyCatalog::class)
            ->set('state_id', (string) $this->cundinamarca->id)
            ->set('propertyType', 'house')
            ->instance()
            ->pageUrl(2);

        $this->assertStringContainsString('state_id='.$this->cundinamarca->id, $url);
        $this->assertStringContainsString('propertyType=house', $url);
        $this->assertStringContainsString('page=2', $url);
    }
}

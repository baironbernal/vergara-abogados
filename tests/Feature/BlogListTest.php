<?php

namespace Tests\Feature;

use App\Livewire\BlogList;
use App\Models\Blog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

/**
 * Covers the Livewire replacement for Pages/Blog/Index.jsx: search, the
 * "featured only" filter and pagination, which used to be Inertia round-trips.
 */
class BlogListTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();

        // 12 published posts; the two newest are featured. Page size is 9.
        foreach (range(1, 12) as $i) {
            Blog::create([
                'title' => "Artículo de prueba {$i}",
                'slug' => "articulo-de-prueba-{$i}",
                'excerpt' => "Extracto {$i}",
                'content' => "<p>Contenido {$i}</p>",
                'status' => 'published',
                'published_at' => now()->subDays($i),
                'featured' => $i <= 2,
                'user_id' => $user->id,
            ]);
        }

        // A draft must never show up in the listing.
        Blog::create([
            'title' => 'Borrador invisible',
            'slug' => 'borrador-invisible',
            'content' => '<p>Borrador</p>',
            'status' => 'draft',
            'published_at' => now()->subDay(),
            'user_id' => $user->id,
        ]);
    }

    public function test_the_listing_page_renders_the_first_page_of_posts(): void
    {
        $this->get('/blog')
            ->assertOk()
            ->assertSee('Artículo de prueba 1')
            ->assertSee('Artículo de prueba 9')
            ->assertDontSee('Artículo de prueba 10')
            ->assertDontSee('Borrador invisible');
    }

    public function test_the_page_query_parameter_selects_the_second_page(): void
    {
        $this->get('/blog?page=2')
            ->assertOk()
            ->assertSee('Artículo de prueba 10')
            ->assertDontSee('Artículo de prueba 1<');
    }

    public function test_searching_filters_the_results(): void
    {
        Livewire::test(BlogList::class)
            ->set('search', 'prueba 7')
            ->call('applyFilters')
            ->assertSee('Artículo de prueba 7')
            ->assertDontSee('Artículo de prueba 8');
    }

    public function test_the_featured_filter_returns_only_featured_posts(): void
    {
        Livewire::test(BlogList::class)
            ->set('featured', true)
            ->call('applyFilters')
            ->assertSee('Artículo de prueba 1')
            ->assertSee('Artículo de prueba 2')
            ->assertDontSee('Artículo de prueba 3');
    }

    public function test_search_filters_are_read_from_the_query_string(): void
    {
        $this->get('/blog?search='.urlencode('prueba 7'))
            ->assertOk()
            ->assertSee('Artículo de prueba 7')
            ->assertDontSee('Artículo de prueba 8');
    }

    public function test_an_empty_result_set_shows_the_empty_state(): void
    {
        Livewire::test(BlogList::class)
            ->set('search', 'no-existe-este-termino')
            ->call('applyFilters')
            ->assertSee('No se encontraron artículos');
    }

    public function test_clearing_filters_restores_the_full_listing(): void
    {
        Livewire::test(BlogList::class)
            ->set('search', 'prueba 7')
            ->set('featured', true)
            ->call('applyFilters')
            ->call('clearFilters')
            ->assertSet('search', '')
            ->assertSet('featured', false)
            ->assertSee('Artículo de prueba 3');
    }

    public function test_applying_a_filter_returns_to_the_first_page(): void
    {
        Livewire::test(BlogList::class)
            ->call('gotoPage', 2)
            ->set('search', 'prueba')
            ->call('applyFilters')
            ->assertSee('Artículo de prueba 1')
            ->assertDontSee('Artículo de prueba 10');
    }

    public function test_an_overlong_search_term_is_truncated_rather_than_failing(): void
    {
        Livewire::test(BlogList::class)
            ->set('search', str_repeat('x', 500))
            ->call('applyFilters')
            ->assertOk()
            ->assertSee('No se encontraron artículos');
    }

    public function test_pagination_links_keep_the_active_filters(): void
    {
        $url = Livewire::test(BlogList::class)
            ->set('search', 'prueba')
            ->set('featured', true)
            ->instance()
            ->pageUrl(3);

        $this->assertStringContainsString('search=prueba', $url);
        $this->assertStringContainsString('featured=true', $url);
        $this->assertStringContainsString('page=3', $url);
    }
}

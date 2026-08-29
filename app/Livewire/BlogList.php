<?php

namespace App\Livewire;

use App\Models\Blog;
use Livewire\Attributes\Url;
use Livewire\Component;
use Livewire\WithPagination;

/**
 * Searchable, filterable blog listing — replaces the search/filter state that
 * lived in Pages/Blog/Index.jsx plus the query building in BlogController@index.
 *
 * Filters live in the query string (#[Url]) so results stay shareable,
 * bookmarkable and crawlable, exactly as the Inertia version behaved.
 */
class BlogList extends Component
{
    use WithPagination;

    private const PER_PAGE = 9;

    /** Kept at 100 chars to avoid a full-table-scan DoS on the content column. */
    private const MAX_SEARCH_LENGTH = 100;

    #[Url(except: '')]
    public string $search = '';

    #[Url(except: false)]
    public bool $featured = false;

    /** Applies the current filters; called on submit, matching the old form. */
    public function applyFilters(): void
    {
        $this->resetPage();
    }

    public function clearFilters(): void
    {
        $this->search = '';
        $this->featured = false;
        $this->resetPage();
    }

    public function render()
    {
        $search = trim(mb_substr($this->search, 0, self::MAX_SEARCH_LENGTH));

        $blogs = Blog::published()
            ->with('user:id,name')
            ->latest('published_at')
            ->when($search !== '', fn ($query) => $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            }))
            ->when($this->featured, fn ($query) => $query->featured())
            ->paginate(self::PER_PAGE);

        return view('livewire.blog-list', [
            'blogs' => $blogs,
        ]);
    }

    /**
     * Builds a crawlable URL for a page of the current result set. Pagination
     * stays as real <a href> links (not wire:click) so search engines can follow
     * them, which is how the Inertia version worked.
     */
    public function pageUrl(int $page): string
    {
        return route('blog.index', array_filter([
            'search' => $this->search !== '' ? $this->search : null,
            'featured' => $this->featured ? 'true' : null,
            'page' => $page > 1 ? $page : null,
        ]));
    }
}

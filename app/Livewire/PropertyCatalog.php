<?php

namespace App\Livewire;

use App\Models\Municipality;
use App\Models\Property;
use App\Models\State;
use Livewire\Attributes\Url;
use Livewire\Component;
use Livewire\WithPagination;

/**
 * Property listing with filters and pagination — replaces Pages/Properties.jsx.
 *
 * The React page shipped every property to the browser and filtered/paginated
 * in JavaScript. Here the filtering happens in SQL, so the page only ever loads
 * one page of results and the 1,100+ municipalities are never all sent at once.
 */
class PropertyCatalog extends Component
{
    use WithPagination;

    private const PER_PAGE = 6;

    #[Url(except: '')]
    public string $state_id = '';

    #[Url(except: '')]
    public string $municipality_id = '';

    #[Url(except: '')]
    public string $minPrice = '';

    #[Url(except: '')]
    public string $maxPrice = '';

    #[Url(except: '')]
    public string $propertyType = '';

    /** Changing the department invalidates the municipality picked under the old one. */
    public function updatedStateId(): void
    {
        $this->municipality_id = '';
        $this->resetPage();
    }

    public function updatedMunicipalityId(): void
    {
        $this->resetPage();
    }

    public function updatedMinPrice(): void
    {
        $this->resetPage();
    }

    public function updatedMaxPrice(): void
    {
        $this->resetPage();
    }

    public function updatedPropertyType(): void
    {
        $this->resetPage();
    }

    public function clearFilters(): void
    {
        $this->reset(['state_id', 'municipality_id', 'minPrice', 'maxPrice', 'propertyType']);
        $this->resetPage();
    }

    public function hasActiveFilters(): bool
    {
        return $this->state_id !== ''
            || $this->municipality_id !== ''
            || $this->minPrice !== ''
            || $this->maxPrice !== ''
            || $this->propertyType !== '';
    }

    public function render()
    {
        $properties = Property::query()
            ->with(['municipality:id,name', 'state:id,name'])
            ->when($this->state_id !== '', fn ($q) => $q->where('state_id', (int) $this->state_id))
            ->when($this->municipality_id !== '', fn ($q) => $q->where('municipality_id', (int) $this->municipality_id))
            ->when(is_numeric($this->minPrice), fn ($q) => $q->where('price', '>=', (float) $this->minPrice))
            ->when(is_numeric($this->maxPrice), fn ($q) => $q->where('price', '<=', (float) $this->maxPrice))
            ->when($this->propertyType !== '', fn ($q) => $q->where('type', $this->propertyType))
            ->select(['id', 'name', 'type', 'thumbnail', 'price', 'size', 'description', 'municipality_id', 'state_id'])
            ->paginate(self::PER_PAGE);

        // type_spanish is not in $appends on the model, so add it per page of results.
        $properties->getCollection()->each->append('type_spanish');

        return view('livewire.property-catalog', [
            'properties' => $properties,
            'states' => State::orderBy('name')->get(['id', 'name']),
            // Only the selected department's municipalities — the select is
            // disabled until a department is chosen, so nothing else is needed.
            'municipalities' => $this->state_id !== ''
                ? Municipality::where('state_id', (int) $this->state_id)->orderBy('name')->get(['id', 'name'])
                : collect(),
            // The old React select showed the raw stored value ("house"); the
            // label now uses the model's type_spanish accessor, like the cards do.
            'propertyTypes' => Property::query()
                ->distinct()
                ->orderBy('type')
                ->pluck('type')
                ->filter()
                ->map(fn ($type) => [
                    'value' => $type,
                    'label' => Property::make(['type' => $type])->type_spanish,
                ])
                ->values(),
        ]);
    }

    /** Crawlable page URL that preserves the active filters (see BlogList). */
    public function pageUrl(int $page): string
    {
        return route('properties.index', array_filter([
            'state_id' => $this->state_id ?: null,
            'municipality_id' => $this->municipality_id ?: null,
            'minPrice' => $this->minPrice ?: null,
            'maxPrice' => $this->maxPrice ?: null,
            'propertyType' => $this->propertyType ?: null,
            'page' => $page > 1 ? $page : null,
        ]));
    }
}

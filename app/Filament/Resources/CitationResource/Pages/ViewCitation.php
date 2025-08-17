<?php

namespace App\Filament\Resources\CitationResource\Pages;

use App\Filament\Resources\CitationResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCitation extends ViewRecord
{
    protected static string $resource = CitationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}

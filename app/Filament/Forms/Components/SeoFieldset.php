<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;

class SeoFieldset
{
    public static function make(string $fieldName = 'seo'): Fieldset
    {
        return Fieldset::make('SEO')
            ->schema([
                TextInput::make("{$fieldName}.title")
                    ->label('SEO Title')
                    ->maxLength(255)
                    ->required()
                    ->helperText('El título que aparecerá en los resultados de búsqueda (máximo 60 caracteres recomendado)'),

                Textarea::make("{$fieldName}.description")
                    ->label('SEO Description')
                    ->maxLength(500)
                    ->required()
                    ->rows(3)
                    ->helperText('La descripción que aparecerá en los resultados de búsqueda (máximo 160 caracteres recomendado)'),

                TextInput::make("{$fieldName}.keywords")
                    ->label('SEO Keywords')
                    ->maxLength(500)
                    ->required()
                    ->helperText('Palabras clave separadas por comas'),
            ])
            ->columns(1);
    }
}

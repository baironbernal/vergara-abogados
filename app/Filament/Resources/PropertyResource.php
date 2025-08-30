<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PropertyResource\Pages;
use App\Models\Property;
use Filament\Forms;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PropertyResource extends Resource
{
    protected static ?string $model = Property::class;

    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static ?string $label = 'Propiedades';

    protected static ?string $navigationGroup = 'Inmobiliaria';
    

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Nombre de la propiedad')
                    ->required(),

                Forms\Components\Select::make('type')
                    ->label('Tipo de propiedad')
                    ->options([
                        'apartment' => 'Apartamento',
                        'house' => 'Casa',
                        'plot' => 'Lote',
                        'finca' => 'Finca',
                        'other' => 'Other',
                    ])
                    ->required(),

                Forms\Components\FileUpload::make('thumbnail')
                    ->label('Foto Principal')
                    ->image()
                    ->disk('public')
                    ->directory('properties/thumbnails')
                    ->visibility('public')
                    ->maxSize(5120) // 5MB
                    ->imageEditor()
                    ->imageEditorAspectRatios([
                        '16:9',
                        '4:3',
                        '1:1',
                    ]),

                Forms\Components\FileUpload::make('gallery')
                    ->label('Galería de Fotos')
                    ->image()
                    ->multiple()
                    ->disk('public')
                    ->directory('properties/gallery')
                    ->visibility('public')
                    ->maxFiles(10)
                    ->maxSize(5120) // 5MB
                    ->imageEditor()
                    ->reorderable()
                    ->panelLayout('grid')
                    ->uploadingMessage('Subiendo fotos...')
                    ->helperText('Máximo 10 imágenes, 5MB cada una'),

                Forms\Components\TextInput::make('price')
                    ->label('Precio')
                    ->numeric()
                    ->prefix('$'),

                Forms\Components\TextInput::make('size')
                    ->label('Tamaño')
                    ->numeric()
                    ->suffix('m²'),

                Forms\Components\Textarea::make('description')
                    ->label('Descripción')
                    ->rows(3)
                    ->columnSpanFull(),

                Forms\Components\TextInput::make('certification')
                    ->label('Certificación')
                    ->placeholder('Certificación de la propiedad')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                ->label('Nombre')
                ->searchable()
                ->sortable(),

                ImageColumn::make('thumbnail')
                    ->label('Foto')
                    ->square(), 

                TextColumn::make('price')
                    ->label('Precio')
                    ->money('COP', true) 
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('name')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('name')
                            ->label('Property Name'),
                    ])
                    ->query(fn ($query, array $data) =>
                        $query->when($data['name'], fn ($q, $name) =>
                            $q->where('name', 'like', "%{$name}%")
                        )
                    ),

                // Type filter (select)
                Tables\Filters\SelectFilter::make('type')
                    ->options([
                        'house' => 'House',
                        'apartment' => 'Apartment',
                        'land' => 'Land',
                        'office' => 'Office',
                    ]),

                // Price range filter
                Tables\Filters\Filter::make('price_range')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('min_price')->numeric(),
                        \Filament\Forms\Components\TextInput::make('max_price')->numeric(),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['min_price'], fn ($q, $min) => $q->where('price', '>=', $min))
                            ->when($data['max_price'], fn ($q, $max) => $q->where('price', '<=', $max));
                    }),

                // Size range filter
                Tables\Filters\Filter::make('size_range')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('min_size')->numeric(),
                        \Filament\Forms\Components\TextInput::make('max_size')->numeric(),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['min_size'], fn ($q, $min) => $q->where('size', '>=', $min))
                            ->when($data['max_size'], fn ($q, $max) => $q->where('size', '<=', $max));
                    }),

                // Certification filter
                Tables\Filters\SelectFilter::make('certification')
                    ->options([
                        'leed' => 'LEED',
                        'breeam' => 'BREEAM',
                        'none' => 'None',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProperties::route('/'),
            'create' => Pages\CreateProperty::route('/create'),
            'edit' => Pages\EditProperty::route('/{record}/edit'),
        ];
    }
}

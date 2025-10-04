<?php

namespace App\Filament\Resources;

use App\Filament\Forms\Components\SeoFieldset;
use App\Filament\Resources\PropertyResource\Pages;
use App\Models\Property;
use App\Models\State;
use App\Models\Municipality;
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
use Illuminate\Support\Facades\Auth;

class PropertyResource extends Resource
{
    protected static ?string $model = Property::class;

    protected static ?string $navigationIcon = 'heroicon-o-home';

    protected static ?string $label = 'Propiedades';

    protected static ?string $navigationGroup = 'Inmobiliaria';

    public static function shouldRegisterNavigation(): bool
    {
        $user = Auth::user();
        if ($user && $user->hasRole('lawyer')) {
            return false;
        }
        return true;
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('Información General')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nombre de la propiedad')
                            ->required()
                            ->columnSpanFull(),

                        Forms\Components\Select::make('type')
                            ->label('Tipo de propiedad')
                            ->options([
                                'apartment' => 'Apartamento',
                                'house' => 'Casa',
                                'plot' => 'Lote',
                                'finca' => 'Finca',
                                'other' => 'Otro',
                            ])
                            ->required(),

                        Forms\Components\TextInput::make('price')
                            ->label('Precio')
                            ->numeric()
                            ->prefix('$'),

                        Forms\Components\TextInput::make('size')
                            ->label('Tamaño')
                            ->numeric()
                            ->suffix('m²'),

                        Forms\Components\Select::make('state_id')
                            ->label('Departamento')
                            ->options(State::all()->pluck('name', 'id')->toArray())
                            ->searchable()
                            ->preload()
                            ->live()
                            ->afterStateUpdated(fn (callable $set) => $set('municipality_id', null))
                            ->required(),

                        Forms\Components\Select::make('municipality_id')
                            ->label('Municipio')
                            ->options(function (callable $get) {
                                $stateId = $get('state_id');
                                if (!$stateId) {
                                    return [];
                                }
                                return Municipality::where('state_id', $stateId)
                                    ->pluck('name', 'id')
                                    ->toArray();
                            })
                            ->searchable()
                            ->preload()
                            ->required()
                            ->disabled(fn (callable $get) => !$get('state_id')),

                        Forms\Components\Textarea::make('description')
                            ->label('Descripción')
                            ->rows(3)
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Imágenes')
                    ->schema([
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
                            ->maxFiles(20)
                            ->maxSize(5120) // 5MB
                            ->imageEditor()
                            ->reorderable()
                            ->panelLayout('grid')
                            ->uploadingMessage('Subiendo fotos...')
                            ->helperText('Máximo 10 imágenes, 5MB cada una'),
                    ])
                    ->collapsed(),

                Forms\Components\Section::make('SEO')
                    ->schema([
                        SeoFieldset::make('seo'),
                    ])
                    ->collapsed(),
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

                TextColumn::make('type')
                    ->label('Tipo')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'apartment' => 'Apartamento',
                        'house' => 'Casa',
                        'plot' => 'Lote',
                        'finca' => 'Finca',
                        'other' => 'Otro',
                        default => $state,
                    })
                    ->color(fn (string $state): string => match ($state) {
                        'apartment' => 'warning',
                        'house' => 'success',
                        'plot' => 'info',
                        'finca' => 'danger',
                        default => 'gray',
                    }),

                TextColumn::make('price')
                    ->label('Precio')
                    ->money('COP', true) 
                    ->sortable(),

                TextColumn::make('municipality.name')
                    ->label('Municipio')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('state.name')
                    ->label('Departamento')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('size')
                    ->label('Tamaño')
                    ->suffix(' m²')
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\Filter::make('name')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('name')
                            ->label('Nombre de la Propiedad'),
                    ])
                    ->query(fn ($query, array $data) =>
                        $query->when($data['name'], fn ($q, $name) =>
                            $q->where('name', 'like', "%{$name}%")
                        )
                    ),

                // Type filter (select)
                Tables\Filters\SelectFilter::make('type')
                    ->label('Tipo de Propiedad')
                    ->options([
                        'apartment' => 'Apartamento',
                        'house' => 'Casa',
                        'plot' => 'Lote',
                        'finca' => 'Finca',
                        'other' => 'Otro',
                    ]),

                Tables\Filters\SelectFilter::make('state_id')
                    ->label('Departamento')
                    ->relationship('state', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\SelectFilter::make('municipality_id')
                    ->label('Municipio')
                    ->relationship('municipality', 'name')
                    ->searchable()
                    ->preload(),

                // Price range filter
                Tables\Filters\Filter::make('price_range')
                    ->label('Rango de Precio')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('min_price')
                            ->label('Precio Mínimo')
                            ->numeric(),
                        \Filament\Forms\Components\TextInput::make('max_price')
                            ->label('Precio Máximo')
                            ->numeric(),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['min_price'], fn ($q, $min) => $q->where('price', '>=', $min))
                            ->when($data['max_price'], fn ($q, $max) => $q->where('price', '<=', $max));
                    }),

                // Size range filter
                Tables\Filters\Filter::make('size_range')
                    ->label('Rango de Tamaño')
                    ->form([
                        \Filament\Forms\Components\TextInput::make('min_size')
                            ->label('Tamaño Mínimo')
                            ->numeric(),
                        \Filament\Forms\Components\TextInput::make('max_size')
                            ->label('Tamaño Máximo')
                            ->numeric(),
                    ])
                    ->query(function ($query, array $data) {
                        return $query
                            ->when($data['min_size'], fn ($q, $min) => $q->where('size', '>=', $min))
                            ->when($data['max_size'], fn ($q, $max) => $q->where('size', '<=', $max));
                    }),
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

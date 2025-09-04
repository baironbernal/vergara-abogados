<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ServiceResource\Pages;
use App\Models\Service;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static ?string $navigationIcon = 'heroicon-o-square-3-stack-3d';

    protected static ?string $label = 'Servicios';

    protected static ?string $navigationGroup = 'Contenido';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')->required(),
                Forms\Components\TextInput::make('slug')->required(),
                Forms\Components\TextInput::make('category')->required(),
                Forms\Components\TextInput::make('subcategory'),
                Forms\Components\Textarea::make('description'),
                Forms\Components\TextInput::make('type'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('slug')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('category')->sortable()->searchable(),
                Tables\Columns\TextColumn::make('subcategory')->sortable(),
                Tables\Columns\TextColumn::make('type')->sortable(),
                Tables\Columns\TextColumn::make('created_at')->dateTime(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')
                ->options([
                    'Inmobiliario' => 'Inmobiliario',
                    'Legal' => 'Legal',
                ])
                ->label('Categoría'),


            Tables\Filters\SelectFilter::make('subcategory')
                ->options([
                    'Derecho Civil' => 'Derecho Civil',
                    'Derecho de Familia' => 'Derecho de Familia',
                    'Derecho Laboral' => 'Derecho Laboral',
                    'Derecho Inmobiliario' => 'Derecho Inmobiliario',
                ])
                ->label('Subcategoría'),

            Tables\Filters\SelectFilter::make('type')
                ->options([
                    'Servicio' => 'Servicio',
                    'Valor' => 'Valor',
                ])
                ->label('Tipo'),
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
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}

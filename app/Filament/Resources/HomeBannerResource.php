<?php

namespace App\Filament\Resources;

use App\Filament\Resources\HomeBannerResource\Pages;
use App\Filament\Resources\HomeBannerResource\RelationManagers;
use App\Models\HomeBanner;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class HomeBannerResource extends Resource
{
    protected static ?string $model = HomeBanner::class;

    protected static ?string $navigationIcon = 'heroicon-o-photo';

    protected static ?string $label = 'Fotos Oficina';

    protected static ?string $pluralLabel = 'Fotos Oficina';

    protected static ?string $navigationGroup = 'Contenido';

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
                Forms\Components\Section::make('Galería de Banners')
                    ->description('Sube hasta 10 imágenes para el banner principal de la página de inicio')
                    ->schema([
                        Forms\Components\FileUpload::make('gallery')
                            ->label('Imágenes del Banner')
                            ->image()
                            ->multiple()
                            ->disk('public')
                            ->directory('home-banners')
                            ->visibility('public')
                            ->maxFiles(10)
                            ->maxSize(5120) // 5MB
                            ->imageEditor()
                            ->reorderable()
                            ->panelLayout('grid')
                            ->required()
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                Tables\Columns\ImageColumn::make('gallery')
                    ->label('Primera Imagen')
                    ->getStateUsing(fn ($record) => $record->gallery[0] ?? null)
                    ->circular()
                    ->size(60),
                Tables\Columns\TextColumn::make('gallery')
                    ->label('Total de Imágenes')
                    ->getStateUsing(fn ($record) => count($record->gallery ?? []))
                    ->badge(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Actualizado')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListHomeBanners::route('/'),
            'create' => Pages\CreateHomeBanner::route('/create'),
            'edit' => Pages\EditHomeBanner::route('/{record}/edit'),
        ];
    }
}

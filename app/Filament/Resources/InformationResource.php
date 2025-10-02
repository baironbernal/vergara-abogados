<?php

namespace App\Filament\Resources;

use App\Filament\Resources\InformationResource\Pages;
use App\Filament\Resources\InformationResource\RelationManagers;
use App\Models\Information;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class InformationResource extends Resource
{
    protected static ?string $model = Information::class;

    protected static ?string $navigationIcon = 'heroicon-o-information-circle';

    protected static ?string $label = 'Información Corporativa';

    protected static ?string $pluralLabel = 'Información Corporativa';

    protected static ?string $navigationGroup = 'Configuración';

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
                Forms\Components\Section::make('Información de Contacto')
                    ->description('Información de contacto corporativa')
                    ->schema([
                        Forms\Components\TextInput::make('corporative_email')
                            ->label('Email Corporativo')
                            ->email()
                            ->required()
                            ->maxLength(255),
                        Forms\Components\TextInput::make('corporative_whatsapp')
                            ->label('WhatsApp Corporativo')
                            ->tel()
                            ->required()
                            ->maxLength(255),
                    ])->columns(2),

                Forms\Components\Section::make('Redes Sociales')
                    ->description('Enlaces a redes sociales corporativas')
                    ->schema([
                        Forms\Components\TextInput::make('corporative_linkedin')
                            ->label('LinkedIn')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-link'),
                        Forms\Components\TextInput::make('corporative_instagram')
                            ->label('Instagram')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-link'),
                        Forms\Components\TextInput::make('corporative_facebook')
                            ->label('Facebook')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-link'),
                        Forms\Components\TextInput::make('corporative_twitter')
                            ->label('Twitter/X')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-link'),
                    ])->columns(2),

                Forms\Components\Section::make('Información Adicional')
                    ->schema([
                        Forms\Components\Textarea::make('office_address')
                            ->label('Dirección de la Oficina')
                            ->required()
                            ->rows(3)
                            ->columnSpanFull(),
                        Forms\Components\TextInput::make('copyright_text')
                            ->label('Derechos Reservados')
                            ->required()
                            ->maxLength(255)
                            ->default('© 2024 Inmobiliaria Vergara y Abogados. Todos los derechos reservados.')
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
                Tables\Columns\TextColumn::make('corporative_email')
                    ->label('Email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('corporative_whatsapp')
                    ->label('WhatsApp')
                    ->searchable(),
                Tables\Columns\TextColumn::make('copyright_text')
                    ->label('Copyright')
                    ->limit(50)
                    ->toggleable(),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Actualizado')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(),
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

    public static function canCreate(): bool
    {
        // Only allow creating if no record exists
        return Information::count() === 0;
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListInformation::route('/'),
            'create' => Pages\CreateInformation::route('/create'),
            'edit' => Pages\EditInformation::route('/{record}/edit'),
        ];
    }
}

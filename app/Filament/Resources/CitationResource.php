<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CitationResource\Pages;
use App\Filament\Resources\CitationResource\RelationManagers;
use App\Models\Citation;
use Filament\Forms;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Facades\Auth;

class CitationResource extends Resource
{
    protected static ?string $model = Citation::class;

    protected static ?string $navigationIcon = 'heroicon-o-chat-bubble-left-right';

    protected static ?string $label = 'Citas';

    protected static ?string $navigationGroup = 'Firma';

    public static function getEloquentQuery(): Builder
    {
        $query = parent::getEloquentQuery();
        $user = Auth::user();

        // Exclude blocked citations
        $query->where(function ($q) {
            $q->where('blocked_by_user', false)->orWhereNull('blocked_by_user');
        });

        // If user is admin, show all citations
        if ($user && $user->hasRole('admin')) {
            return $query;
        }

        // If user is a lawyer, show their citations AND citations available for any lawyer (lawyer_id = null)
        if ($user && $user->hasRole('lawyer')) {
            $lawyer = $user->lawyer;
            if ($lawyer) {
                return $query->where(function ($q) use ($lawyer) {
                    $q->where('lawyer_id', $lawyer->id)
                      ->orWhereNull('lawyer_id');
                });
            }
        }

        // Default: no citations if user doesn't have proper role
        return $query->whereRaw('1 = 0');
    }

    public static function form(Form $form): Form
    {
        return $form
        ->schema([
            Forms\Components\Section::make('Detalles')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Nombre')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('phone')
                        ->label('Teléfono')
                        ->tel()
                        ->maxLength(50),
                    TextInput::make('email')
                        ->label('Correo')
                        ->email()
                        ->maxLength(255),
                    Select::make('lawyer_id')
                        ->label('Abogado')
                        ->relationship('lawyer', 'name')
                        ->searchable()
                        ->preload()
                        ->required()
                        ->default(function () {
                            $user = Auth::user();
                            if ($user && $user->hasRole('lawyer') && $user->lawyer) {
                                return $user->lawyer->id;
                            }
                            return null;
                        })
                        ->disabled(function () {
                            $user = Auth::user();
                            return $user && $user->hasRole('lawyer');
                        }),
                    DateTimePicker::make('starts_at')
                        ->label('Inicia')
                        ->required()
                        ->seconds(false),
                    DateTimePicker::make('ends_at')
                        ->label('Termina')
                        ->seconds(false)
                        ->after('starts_at'),
                    Textarea::make('observations')
                        ->label('Observaciones')
                        ->columnSpanFull()
                        ->rows(4),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('Nombre')->searchable()->sortable(),
                TextColumn::make('phone')->label('Teléfono')->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('email')->label('Correo')->searchable()->toggleable(),
                TextColumn::make('lawyer_name')
                    ->label('Abogado')
                    ->badge()
                    ->getStateUsing(fn (Citation $record) =>
                        $record->lawyer_id
                            ? $record->lawyer?->name
                            : 'N/A'
                    )
                    ->color(fn (Citation $record) =>
                        $record->lawyer_id ? 'success' : 'danger'
                    ),
                TextColumn::make('starts_at')
                    ->label('Inicia')
                    ->dateTime('Y-m-d H:i')
                    ->sortable(),
                TextColumn::make('ends_at')
                    ->label('Termina')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(),
                TextColumn::make('observations')
                    ->label('Observaciones')
                    ->limit(40)
                    ->toggleable(),
                TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime('Y-m-d H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('starts_at', 'desc')
            ->filters([
                Filter::make('starts_between')
                    ->form([
                        Forms\Components\DatePicker::make('from')->label('Desde'),
                        Forms\Components\DatePicker::make('until')->label('Hasta'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when($data['from'] ?? null, fn (Builder $q, $date) => $q->whereDate('starts_at', '>=', $date))
                            ->when($data['until'] ?? null, fn (Builder $q, $date) => $q->whereDate('starts_at', '<=', $date));
                    }),

                Tables\Filters\SelectFilter::make('lawyer_id')
                    ->label('Abogado')
                    ->relationship('lawyer', 'name')
                    ->searchable()
                    ->preload(),

                Tables\Filters\TernaryFilter::make('without_lawyer')
                    ->label('N/A (Sin Abogado)')
                    ->placeholder('All citations')
                    ->trueLabel('Only N/A')
                    ->falseLabel('With Lawyer')
                    ->queries(
                        true: fn (Builder $query) => $query->whereNull('lawyer_id'),
                        false: fn (Builder $query) => $query->whereNotNull('lawyer_id'),
                    ),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function canCreate(): bool
    {
        // Disable create button - citations are created from the public contact form
        return false;
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
            'index' => Pages\ListCitations::route('/'),
            'create' => Pages\CreateCitation::route('/create'),
            'view' => Pages\ViewCitation::route('/{record}'),
            'edit' => Pages\EditCitation::route('/{record}/edit'),
        ];
    }
}

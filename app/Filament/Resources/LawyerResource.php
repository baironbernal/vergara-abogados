<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LawyerResource\Pages;
use App\Filament\Resources\LawyerResource\RelationManagers;
use App\Models\Lawyer;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class LawyerResource extends Resource
{
    protected static ?string $model = Lawyer::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static ?string $label = 'Abogados';

    protected static ?string $navigationGroup = 'Firma';

    public static function form(Form $form): Form
    {
        return $form
        ->schema([
            Forms\Components\Section::make('Lawyer Info')
                ->columns(2)
                ->schema([
                    TextInput::make('name')
                        ->label('Name')
                        ->required()
                        ->maxLength(255),
                    TextInput::make('profession')
                        ->label('Profession')
                        ->required()
                        ->maxLength(255),
                    Forms\Components\Textarea::make('description')
                        ->label('Description')
                        ->rows(3)
                        ->columnSpanFull(),
                    TextInput::make('phone')
                        ->label('Phone')
                        ->tel()
                        ->maxLength(50),
                    TextInput::make('email')
                        ->label('Email')
                        ->email()
                        ->maxLength(255),
                    FileUpload::make('image')
                        ->label('Profile Image')
                        ->disk('public')
                        ->directory('lawyers')
                        ->image()
                        ->imageEditor()
                        ->visibility('public')
                        ->preserveFilenames()
                        ->maxFiles(1)
                        ->columnSpanFull(),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')->label('Image')->circular(),
                TextColumn::make('name')->sortable()->searchable(),
                TextColumn::make('profession')->sortable()->searchable(),
                TextColumn::make('phone')->toggleable(),
                TextColumn::make('email')->sortable()->searchable(),
                TextColumn::make('created_at')->dateTime('Y-m-d H:i')->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
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
            'index' => Pages\ListLawyers::route('/'),
            'create' => Pages\CreateLawyer::route('/create'),
            'edit' => Pages\EditLawyer::route('/{record}/edit'),
        ];
    }
}

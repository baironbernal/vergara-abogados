<?php

namespace App\Filament\Resources;

use App\Filament\Resources\LawyerResource\Pages;
use App\Filament\Resources\LawyerResource\RelationManagers;
use App\Models\Lawyer;
use Filament\Forms;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Select;
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
            Forms\Components\Tabs::make('Información del Abogado')
                ->tabs([
                    Forms\Components\Tabs\Tab::make('Información Básica')
                        ->schema([
                            TextInput::make('name')
                                ->label('Nombre Completo')
                                ->required()
                                ->maxLength(255)
                                ->columnSpanFull(),

                            TextInput::make('slug')
                                ->label('Slug (URL)')
                                ->maxLength(255)
                                ->unique(ignoreRecord: true)
                                ->helperText('Se generará automáticamente si se deja vacío'),

                            TextInput::make('title')
                                ->label('Título Profesional')
                                ->placeholder('Ej: Abogado Senior, Socio')
                                ->maxLength(255),

                            TextInput::make('profession')
                                ->label('Profesión')
                                ->required()
                                ->maxLength(255),

                            Forms\Components\Textarea::make('description')
                                ->label('Descripción Corta')
                                ->rows(2)
                                ->maxLength(500)
                                ->helperText('Descripción breve para listados')
                                ->columnSpanFull(),

                            Forms\Components\RichEditor::make('bio')
                                ->label('Biografía Completa')
                                ->columnSpanFull()
                                ->helperText('Biografía detallada para la página de perfil'),

                            FileUpload::make('image')
                                ->label('Foto de Perfil')
                                ->disk('public')
                                ->directory('lawyers')
                                ->image()
                                ->imageEditor()
                                ->imageEditorAspectRatios(['1:1'])
                                ->visibility('public')
                                ->maxFiles(1)
                                ->columnSpanFull(),
                        ])
                        ->columns(2),

                    Forms\Components\Tabs\Tab::make('Contacto')
                        ->schema([
                            TextInput::make('phone')
                                ->label('Teléfono')
                                ->tel()
                                ->maxLength(50),

                            TextInput::make('email')
                                ->label('Correo Electrónico')
                                ->email()
                                ->maxLength(255),

                            TextInput::make('office_location')
                                ->label('Ubicación de Oficina')
                                ->maxLength(255),

                            Forms\Components\Textarea::make('office_hours')
                                ->label('Horario de Atención')
                                ->rows(3)
                                ->placeholder('Lunes a Viernes: 9:00 AM - 6:00 PM'),

                            TextInput::make('linkedin')
                                ->label('LinkedIn')
                                ->url()
                                ->maxLength(255),

                            TextInput::make('facebook')
                                ->label('Facebook')
                                ->url()
                                ->maxLength(255),

                            TextInput::make('twitter')
                                ->label('Twitter/X')
                                ->url()
                                ->maxLength(255),

                            TextInput::make('instagram')
                                ->label('Instagram')
                                ->url()
                                ->maxLength(255),
                        ])
                        ->columns(2),

                    Forms\Components\Tabs\Tab::make('Experiencia y Educación')
                        ->schema([
                            TextInput::make('years_experience')
                                ->label('Años de Experiencia')
                                ->numeric()
                                ->minValue(0),

                            TextInput::make('cases_won')
                                ->label('Casos Ganados')
                                ->numeric()
                                ->minValue(0),

                            Forms\Components\Repeater::make('education')
                                ->label('Educación')
                                ->schema([
                                    TextInput::make('degree')
                                        ->label('Título')
                                        ->required(),
                                    TextInput::make('institution')
                                        ->label('Institución')
                                        ->required(),
                                    TextInput::make('year')
                                        ->label('Año')
                                        ->numeric(),
                                ])
                                ->columns(3)
                                ->columnSpanFull()
                                ->defaultItems(0)
                                ->reorderable(),

                            Forms\Components\Repeater::make('experience')
                                ->label('Experiencia Laboral')
                                ->schema([
                                    TextInput::make('position')
                                        ->label('Cargo')
                                        ->required(),
                                    TextInput::make('company')
                                        ->label('Empresa/Firma')
                                        ->required(),
                                    TextInput::make('period')
                                        ->label('Período')
                                        ->placeholder('2020 - Presente'),
                                    Forms\Components\Textarea::make('description')
                                        ->label('Descripción')
                                        ->rows(2),
                                ])
                                ->columns(2)
                                ->columnSpanFull()
                                ->defaultItems(0)
                                ->reorderable(),
                        ]),

                    Forms\Components\Tabs\Tab::make('Especialidades y Logros')
                        ->schema([
                            Forms\Components\Repeater::make('specializations')
                                ->label('Áreas de Especialización')
                                ->schema([
                                    TextInput::make('area')
                                        ->label('Área')
                                        ->required(),
                                    TextInput::make('percentage')
                                        ->label('Porcentaje de Experiencia (%)')
                                        ->numeric()
                                        ->minValue(0)
                                        ->maxValue(100),
                                ])
                                ->columns(2)
                                ->columnSpanFull()
                                ->defaultItems(0),

                            Forms\Components\Repeater::make('achievements')
                                ->label('Logros y Reconocimientos')
                                ->schema([
                                    TextInput::make('title')
                                        ->label('Título')
                                        ->required(),
                                    TextInput::make('year')
                                        ->label('Año')
                                        ->numeric(),
                                    Forms\Components\Textarea::make('description')
                                        ->label('Descripción')
                                        ->rows(2),
                                ])
                                ->columns(2)
                                ->columnSpanFull()
                                ->defaultItems(0),
                        ]),

                    Forms\Components\Tabs\Tab::make('Configuración')
                        ->schema([
                            Select::make('user_id')
                                ->label('Usuario Asociado')
                                ->relationship('user', 'name')
                                ->searchable()
                                ->preload(),

                            Forms\Components\Toggle::make('is_featured')
                                ->label('Abogado Destacado')
                                ->helperText('Aparecerá en secciones destacadas'),

                            TextInput::make('order')
                                ->label('Orden de Visualización')
                                ->numeric()
                                ->default(0)
                                ->helperText('Número menor aparece primero'),
                        ])
                        ->columns(2),
                ])
                ->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')->label('Imagen')->circular(),
                TextColumn::make('name')->label('Nombre')->sortable()->searchable(),
                TextColumn::make('profession')->label('Profesión')->sortable()->searchable(),
                TextColumn::make('user.name')->label('Cuenta de Usuario')->sortable()->searchable(),
                TextColumn::make('phone')->label('Teléfono')->toggleable(),
                TextColumn::make('email')->label('Correo')->sortable()->searchable(),
                TextColumn::make('created_at')->label('Creado')->dateTime('Y-m-d H:i')->sortable()->toggleable(isToggledHiddenByDefault: true),
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

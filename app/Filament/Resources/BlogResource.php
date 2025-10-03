<?php

namespace App\Filament\Resources;

use App\Filament\Forms\Components\SeoFieldset;
use App\Filament\Resources\BlogResource\Pages;
use App\Filament\Resources\BlogResource\RelationManagers;
use App\Models\Blog;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Illuminate\Support\Str;

class BlogResource extends Resource
{
    protected static ?string $model = Blog::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Content';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('Blog')
                    ->tabs([
                        Forms\Components\Tabs\Tab::make('General')
                            ->schema([
                                Forms\Components\TextInput::make('title')
                                    ->label('Título')
                                    ->required()
                                    ->maxLength(255)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => $operation === 'create' ? $set('slug', Str::slug($state)) : null),

                                Forms\Components\TextInput::make('slug')
                                    ->label('Slug')
                                    ->required()
                                    ->maxLength(255)
                                    ->unique(Blog::class, 'slug', ignoreRecord: true)
                                    ->rules(['alpha_dash']),

                                Forms\Components\Textarea::make('excerpt')
                                    ->label('Extracto')
                                    ->rows(3)
                                    ->maxLength(500)
                                    ->columnSpanFull(),

                                Forms\Components\RichEditor::make('content')
                                    ->label('Contenido')
                                    ->required()
                                    ->columnSpanFull(),

                                Forms\Components\Select::make('status')
                                    ->label('Estado')
                                    ->options([
                                        'draft' => 'Borrador',
                                        'published' => 'Publicado',
                                        'archived' => 'Archivado',
                                    ])
                                    ->required()
                                    ->default('draft'),

                                Forms\Components\DateTimePicker::make('published_at')
                                    ->label('Fecha de Publicación')
                                    ->default(now()),

                                Forms\Components\Toggle::make('featured')
                                    ->label('Artículo Destacado'),

                                Forms\Components\Hidden::make('user_id')
                                    ->default(auth()->id()),
                            ])->columns(2),

                        Forms\Components\Tabs\Tab::make('Media')
                            ->schema([
                                Forms\Components\FileUpload::make('featured_image')
                                    ->label('Imagen Destacada')
                                    ->image()
                                    ->disk('public')
                                    ->directory('blog/featured')
                                    ->visibility('public')
                                    ->maxSize(5120) // 5MB
                                    ->imageEditor()
                                    ->imageEditorAspectRatios([
                                        '16:9',
                                        '4:3',
                                        '1:1',
                                    ])
                                    ->helperText('Imagen principal del artículo'),

                                Forms\Components\FileUpload::make('gallery')
                                    ->label('Galería de Imágenes')
                                    ->image()
                                    ->multiple()
                                    ->disk('public')
                                    ->directory('blog/gallery')
                                    ->visibility('public')
                                    ->maxFiles(10)
                                    ->maxSize(5120) // 5MB
                                    ->imageEditor()
                                    ->reorderable()
                                    ->panelLayout('grid')
                                    ->uploadingMessage('Subiendo imágenes...')
                                    ->helperText('Imágenes adicionales para el artículo'),
                            ]),

                        Forms\Components\Tabs\Tab::make('SEO')
                            ->schema([
                                SeoFieldset::make('seo'),

                                Forms\Components\Section::make('Meta Tags (Legacy - Optional)')
                                    ->description('Estos campos se mantienen por compatibilidad')
                                    ->schema([
                                        Forms\Components\TextInput::make('meta_title')
                                            ->label('Título Meta')
                                            ->maxLength(255)
                                            ->helperText('Dejar vacío para usar el título'),

                                        Forms\Components\Textarea::make('meta_description')
                                            ->label('Descripción Meta')
                                            ->rows(3)
                                            ->maxLength(160)
                                            ->helperText('Recomendado: 150-160 caracteres'),

                                        Forms\Components\TextInput::make('meta_keywords')
                                            ->label('Palabras Clave Meta')
                                            ->maxLength(255)
                                            ->helperText('Separar palabras clave con comas'),
                                    ])
                                    ->collapsed(),
                            ]),
                    ])->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')
                    ->label('Imagen')
                    ->square()
                    ->defaultImageUrl('/images/shared/background-title.webp'),

                Tables\Columns\TextColumn::make('title')
                    ->label('Título')
                    ->searchable()
                    ->sortable()
                    ->limit(50),

                Tables\Columns\TextColumn::make('slug')
                    ->label('Slug')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\BadgeColumn::make('status')
                    ->label('Estado')
                    ->colors([
                        'warning' => 'draft',
                        'success' => 'published',
                        'danger' => 'archived',
                    ]),

                Tables\Columns\IconColumn::make('featured')
                    ->label('Destacado')
                    ->boolean(),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('Autor')
                    ->sortable(),

                Tables\Columns\TextColumn::make('published_at')
                    ->label('Publicado')
                    ->dateTime()
                    ->sortable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Estado')
                    ->options([
                        'draft' => 'Borrador',
                        'published' => 'Publicado',
                        'archived' => 'Archivado',
                    ]),

                Tables\Filters\TernaryFilter::make('featured')
                    ->label('Destacado'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
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
            'index' => Pages\ListBlogs::route('/'),
            'create' => Pages\CreateBlog::route('/create'),
            'view' => Pages\ViewBlog::route('/{record}'),
            'edit' => Pages\EditBlog::route('/{record}/edit'),
        ];
    }
}

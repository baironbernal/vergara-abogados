<?php

namespace App\Filament\Widgets;

use App\Filament\Resources\CitationResource;
use App\Models\Citation;
use App\Models\Lawyer;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Toggle;
use Filament\Forms;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Saade\FilamentFullCalendar\Actions\CreateAction;
use Saade\FilamentFullCalendar\Actions\EditAction;
use Saade\FilamentFullCalendar\Actions\DeleteAction;
use Saade\FilamentFullCalendar\Actions\ViewAction;
use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;

class CalendarWidget extends FullCalendarWidget
{
    public Model | string | null $model = Citation::class;

    public static function canView(): bool
    {
         $user = Auth::user();
         return $user && ($user->hasRole('admin') || $user->hasRole('lawyer'));
    }

    public function config(): array
    {
        return [
            'initialView' => 'timeGridWeek',
            'headerToolbar' => [
                'left' => 'prev,next today',
                'center' => 'title',
                'right' => 'timeGridWeek,timeGridDay',
            ],
            'slotMinTime' => '09:00:00',
            'slotMaxTime' => '18:00:00',
            'slotDuration' => '00:30:00',
            'slotLabelInterval' => '00:30:00',
            'slotLabelFormat' => [
                'hour' => 'numeric',
                'minute' => '2-digit',
                'hour12' => true,
            ],
            'businessHours' => [
                'daysOfWeek' => [1, 2, 3, 4, 5],
                'startTime' => '09:00',
                'endTime' => '18:00',
            ],
            'weekends' => false,
            'allDaySlot' => false,
            'selectable' => true,
            'selectMirror' => true,
            'selectOverlap' => false,
            'selectConstraint' => 'businessHours',
            'eventOverlap' => false,
            'height' => 'auto',
            'locale' => 'es',
        ];
    }

    public function resolveEventRecord(array $data): ?Citation
    {
        return Citation::find($data['id']);
    }

    public function getFormSchema(): array
    {
        $user = Auth::user();
        $isLawyer = $user?->hasRole('lawyer');

        return [
            Toggle::make('is_blocked_hours')
                ->label('¿Es bloqueo de horario?')
                ->default(false)
                ->live(),

            Select::make('lawyer_id')
                ->label('Abogado')
                ->options(Lawyer::all()->pluck('name', 'id'))
                ->searchable()
                ->required()
                ->default(function () use ($user, $isLawyer) {
                    if ($isLawyer && $user->lawyer) {
                        return $user->lawyer->id;
                    }
                    return null;
                })
                ->visible(fn () => !$isLawyer),

            TextInput::make('name')
                ->label('Nombre del Cliente')
                ->required(fn (Forms\Get $get) => !$get('is_blocked_hours'))
                ->visible(fn (Forms\Get $get) => !$get('is_blocked_hours'))
                ->maxLength(255),

            TextInput::make('phone')
                ->label('Teléfono')
                ->tel()
                ->required(fn (Forms\Get $get) => !$get('is_blocked_hours'))
                ->visible(fn (Forms\Get $get) => !$get('is_blocked_hours'))
                ->maxLength(20),

            TextInput::make('email')
                ->label('Email')
                ->email()
                ->required(fn (Forms\Get $get) => !$get('is_blocked_hours'))
                ->visible(fn (Forms\Get $get) => !$get('is_blocked_hours'))
                ->maxLength(255),

            Textarea::make('observations')
                ->label('Observaciones')
                ->rows(3)
                ->placeholder(fn (Forms\Get $get) =>
                    $get('is_blocked_hours')
                        ? 'Razón del bloqueo (ej: Reunión externa, Vacaciones, etc.)'
                        : 'Notas adicionales sobre la cita...'
                ),
        ];
    }

    public function fetchEvents(array $fetchInfo): array
    {
        $user = Auth::user();

        $query = Citation::query();

        // If user is lawyer, only show their citations
        if ($user->hasRole('lawyer') && $user->lawyer) {
            $query->where('lawyer_id', $user->lawyer->id);
        }

        return $query->get()
            ->map(function (Citation $event) {
                $isBlocked = $event->blocked_by_user;

                return [
                    'id' => $event->id,
                    'title' => $isBlocked
                        ? '🔒 Bloqueado: ' . $event->lawyer->name
                        : "#{$event->id} - {$event->name}",
                    'start' => $event->starts_at,
                    'end' => $event->ends_at,
                    'backgroundColor' => $isBlocked ? '#555555' : '#C59B40',
                    'textColor' => '#ffffff',
                    'extendedProps' => [
                        'isBlocked' => $isBlocked,
                    ],
                ];
            })
            ->toArray();

    }

    protected function headerActions(): array
    {
        return [
            CreateAction::make()
                ->label('Nueva Cita')
                ->modalHeading('Crear Nueva Cita/Bloqueo')
                ->mountUsing(function (Forms\Form $form, array $arguments) {
                    $form->fill([
                        'is_blocked_hours' => false,
                    ]);
                })
                ->using(function (array $data, array $arguments): Citation {
                    $user = Auth::user();

                    // Get dates from calendar selection (clicked slot)
                    $startsAt = $arguments['start'] ?? null;
                    $endsAt = $arguments['end'] ?? null;

                    // Auto-set lawyer_id if user is lawyer
                    $lawyerId = $data['lawyer_id'] ?? null;
                    if ($user->hasRole('lawyer') && $user->lawyer) {
                        $lawyerId = $user->lawyer->id;
                    }

                    if ($data['is_blocked_hours']) {
                        return Citation::create([
                            'name' => 'Horario Bloqueado',
                            'phone' => '-',
                            'email' => $user->email,
                            'lawyer_id' => $lawyerId,
                            'starts_at' => $startsAt,
                            'ends_at' => $endsAt,
                            'observations' => $data['observations'] ?? null,
                            'blocked_by_user' => true,
                            'blocked_by_user_id' => $user->id,
                        ]);
                    } else {
                        return Citation::create([
                            'name' => $data['name'],
                            'phone' => $data['phone'],
                            'email' => $data['email'],
                            'lawyer_id' => $lawyerId,
                            'starts_at' => $startsAt,
                            'ends_at' => $endsAt,
                            'observations' => $data['observations'] ?? null,
                            'blocked_by_user' => false,
                        ]);
                    }
                })
                ->successNotificationTitle('Cita creada exitosamente'),
        ];
    }

    protected function modalActions(): array
    {
        return [
            ViewAction::make()
                ->modalHeading(fn (?Citation $record) => $record && $record->blocked_by_user
                    ? 'Ver Bloqueo de Horario'
                    : 'Ver Cita'),

            EditAction::make()
                ->modalHeading(fn (?Citation $record) => $record && $record->blocked_by_user
                    ? 'Editar Bloqueo'
                    : 'Editar Cita')
                ->mountUsing(function (Citation $record, Forms\Form $form, array $arguments) {
                    $user = Auth::user();
                    $isLawyer = $user?->hasRole('lawyer');

                    $fillData = [
                        'name' => $record->name,
                        'phone' => $record->phone,
                        'email' => $record->email,
                        'is_blocked_hours' => $record->blocked_by_user,
                        'observations' => $record->observations,
                    ];

                    // Only add lawyer_id if user is not a lawyer
                    if (!$isLawyer) {
                        $fillData['lawyer_id'] = $record->lawyer_id;
                    }

                    $form->fill($fillData);
                }),

            DeleteAction::make()
                ->label(fn (?Citation $record) => $record && $record->blocked_by_user ? 'Desbloquear' : 'Eliminar')
                ->modalHeading(fn (?Citation $record) => $record && $record->blocked_by_user
                    ? '¿Desbloquear este horario?'
                    : '¿Eliminar esta cita?')
                ->modalDescription(fn (?Citation $record) => $record && $record->blocked_by_user
                    ? 'Este horario volverá a estar disponible para nuevas citas.'
                    : 'Esta acción no se puede deshacer.')
                ->modalSubmitActionLabel(fn (?Citation $record) => $record && $record->blocked_by_user
                    ? 'Sí, desbloquear'
                    : 'Sí, eliminar')
                ->successNotificationTitle(fn (?Citation $record) => $record && $record->blocked_by_user
                    ? 'Horario desbloqueado'
                    : 'Cita eliminada'),
        ];
    }
}

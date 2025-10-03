<?php

namespace App\Filament\Widgets;

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
use Saade\FilamentFullCalendar\Data\EventData;
use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;

class CalendarWidget extends FullCalendarWidget
{
    public Model | string | null $model = Citation::class;
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

    public function getFormSchema(): array
    {
        return [
            Toggle::make('is_blocked_hours')
                ->label('¿Es bloqueo de horario?')
                ->default(false)
                ->live()
                ->afterStateUpdated(fn () => $this->dispatch('refreshEvents')),

            Select::make('lawyer_id')
                ->label('Abogado')
                ->options(Lawyer::all()->pluck('name', 'id'))
                ->searchable()
                ->required()
                ->default(function () {
                    $user = Auth::user();
                    if ($user?->hasRole('lawyer') && $user->lawyer) {
                        return $user->lawyer->id;
                    }
                    return null;
                })
                ->disabled(fn () => Auth::user()?->hasRole('lawyer')),

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

            DateTimePicker::make('starts_at')
                ->label('Fecha y Hora de Inicio')
                ->required()
                ->native(false)
                ->displayFormat('d/m/Y H:i')
                ->seconds(false),

            DateTimePicker::make('ends_at')
                ->label('Fecha y Hora de Fin')
                ->required()
                ->native(false)
                ->displayFormat('d/m/Y H:i')
                ->seconds(false),

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
        // Simple query to test - get all events in range
        $events = Citation::query()
            ->whereNotNull('starts_at')
            ->whereNotNull('ends_at')
            ->where('starts_at', '<=', $fetchInfo['end'])
            ->where('ends_at', '>=', $fetchInfo['start'])
            ->with('lawyer')
            ->get()
            ->map(function (Citation $citation) {
                $isBlocked = $citation->blocked_by_user;

                // Create meaningful title based on citation type
                $title = $isBlocked
                    ? '🔒 ' . ($citation->observations ?: 'Horario Bloqueado')
                    : '👤 ' . $citation->name . ' - ' . $citation->lawyer->name;

                return EventData::make()
                    ->id($citation->id)
                    ->title($title)
                    ->start($citation->starts_at)
                    ->end($citation->ends_at)
                    ->backgroundColor($isBlocked ? '#ef4444' : '#3b82f6')
                    ->borderColor($isBlocked ? '#dc2626' : '#2563eb')
                    ->textColor('#ffffff');
            })
            ->all();

        return $events;
    }

    protected function headerActions(): array
    {
        return [
            CreateAction::make()
                ->label('Nueva Cita')
                ->modalHeading('Crear Nueva Cita')
                ->mountUsing(function (Forms\Form $form, array $arguments) {
                    $form->fill([
                        'starts_at' => $arguments['start'] ?? null,
                        'ends_at' => $arguments['end'] ?? null,
                        'is_blocked_hours' => false,
                    ]);
                })
                ->action(function (array $data): void {
                    $user = Auth::user();

                    if ($data['is_blocked_hours']) {
                        // Create blocked hours entry
                        Citation::create([
                            'name' => 'Horario Bloqueado',
                            'phone' => '-',
                            'email' => $user->email,
                            'lawyer_id' => $data['lawyer_id'],
                            'starts_at' => $data['starts_at'],
                            'ends_at' => $data['ends_at'],
                            'observations' => $data['observations'] ?? null,
                            'blocked_by_user' => true,
                            'blocked_by_user_id' => $user->id,
                        ]);
                    } else {
                        // Create regular citation
                        Citation::create([
                            'name' => $data['name'],
                            'phone' => $data['phone'],
                            'email' => $data['email'],
                            'lawyer_id' => $data['lawyer_id'],
                            'starts_at' => $data['starts_at'],
                            'ends_at' => $data['ends_at'],
                            'observations' => $data['observations'] ?? null,
                            'blocked_by_user' => false,
                        ]);
                    }
                })
                ->successNotificationTitle('Cita creada exitosamente')
                ->after(fn () => $this->dispatch('refreshEvents')),

            CreateAction::make('block_hours')
                ->label('Bloquear Horario')
                ->modalHeading('Bloquear Horario')
                ->icon('heroicon-o-lock-closed')
                ->color('danger')
                ->mountUsing(function (Forms\Form $form, array $arguments) {
                    $form->fill([
                        'starts_at' => $arguments['start'] ?? null,
                        'ends_at' => $arguments['end'] ?? null,
                        'is_blocked_hours' => true,
                    ]);
                })
                ->form([
                    Select::make('lawyer_id')
                        ->label('Abogado')
                        ->options(Lawyer::all()->pluck('name', 'id'))
                        ->searchable()
                        ->required()
                        ->default(function () {
                            $user = Auth::user();
                            if ($user?->hasRole('lawyer') && $user->lawyer) {
                                return $user->lawyer->id;
                            }
                            return null;
                        })
                        ->disabled(fn () => Auth::user()?->hasRole('lawyer')),

                    DateTimePicker::make('starts_at')
                        ->label('Fecha y Hora de Inicio')
                        ->required()
                        ->native(false)
                        ->displayFormat('d/m/Y H:i')
                        ->seconds(false),

                    DateTimePicker::make('ends_at')
                        ->label('Fecha y Hora de Fin')
                        ->required()
                        ->native(false)
                        ->displayFormat('d/m/Y H:i')
                        ->seconds(false),

                    Textarea::make('observations')
                        ->label('Razón del Bloqueo')
                        ->rows(3)
                        ->placeholder('Ej: Reunión externa, Vacaciones, etc.')
                        ->required(),
                ])
                ->action(function (array $data): void {
                    $user = Auth::user();

                    Citation::create([
                        'name' => 'Horario Bloqueado',
                        'phone' => '-',
                        'email' => $user->email,
                        'lawyer_id' => $data['lawyer_id'],
                        'starts_at' => $data['starts_at'],
                        'ends_at' => $data['ends_at'],
                        'observations' => $data['observations'],
                        'blocked_by_user' => true,
                        'blocked_by_user_id' => $user->id,
                    ]);
                })
                ->successNotificationTitle('Horario bloqueado exitosamente')
                ->after(fn () => $this->dispatch('refreshEvents')),
        ];
    }

    protected function modalActions(): array
    {
        return [
            ViewAction::make()
                ->label('Ver Detalles'),

            EditAction::make()
                ->label('Editar')
                ->mountUsing(function (Citation $record, Forms\Form $form, array $arguments) {
                    $form->fill([
                        'name' => $record->name,
                        'phone' => $record->phone,
                        'email' => $record->email,
                        'lawyer_id' => $record->lawyer_id,
                        'starts_at' => $arguments['event']['start'] ?? $record->starts_at,
                        'ends_at' => $arguments['event']['end'] ?? $record->ends_at,
                        'observations' => $record->observations,
                    ]);
                })
                ->successNotificationTitle('Cita actualizada exitosamente')
                ->after(fn () => $this->dispatch('refreshEvents')),

            DeleteAction::make()
                ->label('Eliminar')
                ->requiresConfirmation()
                ->successNotificationTitle('Cita eliminada exitosamente')
                ->after(fn () => $this->dispatch('refreshEvents')),
        ];
    }
}

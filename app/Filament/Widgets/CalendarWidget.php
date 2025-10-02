<?php

namespace App\Filament\Widgets;

use App\Models\Citation;
use App\Models\Lawyer;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Illuminate\Support\Facades\Auth;
use Saade\FilamentFullCalendar\Actions\CreateAction;
use Saade\FilamentFullCalendar\Data\EventData;
use Saade\FilamentFullCalendar\Widgets\FullCalendarWidget;

class CalendarWidget extends FullCalendarWidget
{
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

                return EventData::make()
                    ->id($citation->id)
                    ->title(
                        $isBlocked
                            ? '🚫 ' . ($citation->lawyer?->name ?? 'Abogado') . ' - Bloqueado'
                            : $citation->name . ' - ' . ($citation->lawyer?->name ?? 'Sin asignar')
                    )
                    ->start($citation->starts_at)
                    ->end($citation->ends_at)
                    ->backgroundColor($isBlocked ? '#ef4444' : '#3b82f6')
                    ->borderColor($isBlocked ? '#dc2626' : '#2563eb')
                    ->textColor('#ffffff');
            })
            ->all();

        return $events;
    }

    protected function modalActions(): array
    {
        return [
            CreateAction::make()
                ->label('Bloquear Horario')
                ->modalHeading('Bloquear Horario')
                ->modalDescription(fn (array $arguments): string =>
                    'De ' .
                    \Carbon\Carbon::parse($arguments['start'])->format('d/m/Y H:i') .
                    ' hasta ' .
                    \Carbon\Carbon::parse($arguments['end'])->format('H:i')
                )
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
                        ->dehydrated()
                        ->disabled(fn () => Auth::user()?->hasRole('lawyer')),
                    Textarea::make('observations')
                        ->label('Razón (opcional)')
                        ->rows(3)
                        ->placeholder('Ej: Reunión externa, Vacaciones, etc.'),
                ])
                ->action(function (array $data, array $arguments): void {
                    $user = Auth::user();

                    if (empty($data['lawyer_id']) && $user?->hasRole('lawyer') && $user->lawyer) {
                        $data['lawyer_id'] = $user->lawyer->id;
                    }

                    Citation::create([
                        'name' => 'Bloqueado',
                        'phone' => '-',
                        'email' => $user->email,
                        'lawyer_id' => $data['lawyer_id'],
                        'starts_at' => $arguments['start'],
                        'ends_at' => $arguments['end'],
                        'observations' => $data['observations'] ?? null,
                        'blocked_by_user' => true,
                        'blocked_by_user_id' => $user->id,
                    ]);
                })
                ->successNotificationTitle('Horario bloqueado exitosamente')
                ->after(fn () => $this->dispatch('refreshEvents')),
        ];
    }
}

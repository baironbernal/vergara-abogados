<?php

namespace App\Observers;

use App\Models\Citation;
use Filament\Notifications\Notification;


class CitationObserver
{
    /**
     * Handle the Citation "created" event.
     */
    public function created(Citation $citation): void
    {
        if ($citation->lawyer && $citation->lawyer->user) {
            Notification::make()
                ->title('Nueva cita asignada')
                ->body("Se te ha asignado una nueva cita con {$citation->name}")
                ->icon('heroicon-o-calendar')
                ->iconColor('success')
                ->sendToDatabase($citation->lawyer->user);
        }
    }

    /**
     * Handle the Citation "updated" event.
     */
    public function updated(Citation $citation): void
    {
        //
    }

    /**
     * Handle the Citation "deleted" event.
     */
    public function deleted(Citation $citation): void
    {
        //
    }

    /**
     * Handle the Citation "restored" event.
     */
    public function restored(Citation $citation): void
    {
        //
    }

    /**
     * Handle the Citation "force deleted" event.
     */
    public function forceDeleted(Citation $citation): void
    {
        //
    }
}

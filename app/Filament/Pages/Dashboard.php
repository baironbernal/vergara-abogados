<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\CalendarWidget;
use Filament\Pages\Dashboard as BaseDashboard;

class Dashboard extends BaseDashboard
{
    public function getWidgets(): array
    {
        return [
            CalendarWidget::class,
        ];
    }

    public function getColumns(): int | string | array
    {
        return 1;
    }
}

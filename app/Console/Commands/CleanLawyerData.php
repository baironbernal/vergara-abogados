<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CleanLawyerData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clean:lawyer-data';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean and migrate lawyer data to remove duplicates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting lawyer data cleanup...');

        // Mapping of old lawyer IDs to new lawyer IDs
        $mapping = [
            1 => 5, // Bryan Vergara (old) -> Brian Vergara (new)
            2 => 6, // Elvis Vergara (old) -> Elvis Vergara (new)  
            3 => 4, // Ivon Vergara (old) -> Dayana Vergara (new)
        ];

        // Migrate citations from old lawyers to new lawyers
        foreach ($mapping as $oldLawyerId => $newLawyerId) {
            $citationsUpdated = \App\Models\Citation::where('lawyer_id', $oldLawyerId)
                ->update(['lawyer_id' => $newLawyerId]);
            
            $this->info("Migrated {$citationsUpdated} citations from lawyer {$oldLawyerId} to lawyer {$newLawyerId}");
        }

        // Delete old lawyer records (without user_id)
        $deletedCount = \App\Models\Lawyer::whereNull('user_id')->delete();
        $this->info("Deleted {$deletedCount} old lawyer records");

        $this->info('Lawyer data cleanup completed!');
        return 0;
    }
}

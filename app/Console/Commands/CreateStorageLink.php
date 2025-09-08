<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateStorageLink extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:link-hostinger';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create storage link for Hostinger environment';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $publicPath = public_path('storage');
        $storagePath = storage_path('app/public');

        // Check if link already exists
        if (file_exists($publicPath)) {
            $this->error('The [public/storage] link already exists.');
            return 1;
        }

        // Try to create symlink first
        if (function_exists('symlink')) {
            if (symlink($storagePath, $publicPath)) {
                $this->info('The [public/storage] link has been connected.');
                return 0;
            }
        }

        // Fallback: copy directory
        if (is_dir($storagePath)) {
            $this->copyDirectory($storagePath, $publicPath);
            $this->info('The [public/storage] directory has been created and files copied.');
            return 0;
        }

        $this->error('Unable to create storage link.');
        return 1;
    }

    private function copyDirectory($source, $destination)
    {
        if (!is_dir($destination)) {
            mkdir($destination, 0755, true);
        }

        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($source, \RecursiveDirectoryIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::SELF_FIRST
        );

        foreach ($iterator as $item) {
            if ($item->isDir()) {
                mkdir($destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName(), 0755, true);
            } else {
                copy($item, $destination . DIRECTORY_SEPARATOR . $iterator->getSubPathName());
            }
        }
    }
}

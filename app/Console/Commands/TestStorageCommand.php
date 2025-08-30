<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class TestStorageCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:storage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test storage configuration and directory structure';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🧪 Testing Storage Configuration');
        $this->newLine();

        // Test public disk
        $this->info('📂 Testing Public Disk...');
        if (Storage::disk('public')->exists('.')) {
            $this->info('✅ Public disk accessible');
        } else {
            $this->error('❌ Public disk not accessible');
            return 1;
        }

        // Test directory structure
        $directories = [
            'properties/thumbnails',
            'properties/gallery',
            'blog/featured',
            'blog/gallery',
            'lawyers',
            'services',
        ];

        $this->info('📁 Testing Directory Structure...');
        foreach ($directories as $dir) {
            if (Storage::disk('public')->exists($dir)) {
                $this->info("✅ Directory exists: {$dir}");
            } else {
                $this->warn("⚠️  Directory missing: {$dir} - Creating...");
                Storage::disk('public')->makeDirectory($dir);
                $this->info("✅ Created: {$dir}");
            }
        }

        // Test file operations
        $this->info('📝 Testing File Operations...');
        
        $testFile = 'test-file.txt';
        $testContent = 'This is a test file created at ' . now();
        
        try {
            // Write test file
            Storage::disk('public')->put($testFile, $testContent);
            $this->info("✅ File write successful: {$testFile}");

            // Read test file
            $content = Storage::disk('public')->get($testFile);
            if ($content === $testContent) {
                $this->info("✅ File read successful");
            } else {
                $this->error("❌ File content mismatch");
            }

            // Get URL
            $url = Storage::disk('public')->url($testFile);
            $this->info("✅ File URL: {$url}");

            // Clean up
            Storage::disk('public')->delete($testFile);
            $this->info("✅ File cleanup successful");

        } catch (\Exception $e) {
            $this->error("❌ File operation failed: " . $e->getMessage());
            return 1;
        }

        // Test symlink
        $this->info('🔗 Testing Storage Symlink...');
        $symlinkPath = public_path('storage');
        if (is_link($symlinkPath)) {
            $this->info('✅ Storage symlink exists');
            $target = readlink($symlinkPath);
            $this->info("   → Points to: {$target}");
        } else {
            $this->error('❌ Storage symlink missing');
            $this->warn('   Run: php artisan storage:link');
        }

        // List existing files
        $this->info('📋 Current Storage Contents...');
        $files = Storage::disk('public')->allFiles();
        if (empty($files)) {
            $this->info('   (No files found)');
        } else {
            foreach ($files as $file) {
                $size = Storage::disk('public')->size($file);
                $this->info("   📄 {$file} ({$size} bytes)");
            }
        }

        $this->newLine();
        $this->info('🎉 Storage test completed successfully!');
        
        return 0;
    }
}

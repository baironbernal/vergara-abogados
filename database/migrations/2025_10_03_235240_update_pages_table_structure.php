<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Check if columns exist before dropping
        if (Schema::hasColumn('pages', 'title')) {
            Schema::table('pages', function (Blueprint $table) {
                // Drop old columns
                $table->dropColumn(['title', 'description', 'keywords', 'slug']);
            });
        }

        // Check if columns don't exist before adding
        if (!Schema::hasColumn('pages', 'name')) {
            Schema::table('pages', function (Blueprint $table) {
                // Add new columns as nullable (SQLite limitation)
                $table->string('name')->nullable()->after('id');
                $table->string('route')->nullable()->unique()->after('name');
                $table->json('seo')->nullable()->after('route');
            });
        }
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            // Restore old columns
            $table->dropColumn(['name', 'route', 'seo']);

            $table->string('title');
            $table->text('description')->nullable();
            $table->text('keywords')->nullable();
            $table->string('slug');
        });
    }
};

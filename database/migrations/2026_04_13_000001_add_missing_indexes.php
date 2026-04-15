<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lawyers', function (Blueprint $table) {
            // slug is used for route model binding on every profile visit
            $table->index('slug');
            // user_id is filtered in HomeController and AboutController
            $table->index('user_id');
            // order + is_featured are sorted/filtered on the homepage
            $table->index(['is_featured', 'order']);
        });

        Schema::table('properties', function (Blueprint $table) {
            // Filtered together on the properties listing page
            $table->index(['state_id', 'municipality_id']);
            $table->index('type');
        });

        Schema::table('citations', function (Blueprint $table) {
            // Used in every calendar query and role-based filtering
            $table->index(['lawyer_id', 'starts_at']);
        });
    }

    public function down(): void
    {
        Schema::table('lawyers', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropIndex(['user_id']);
            $table->dropIndex(['is_featured', 'order']);
        });

        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['state_id', 'municipality_id']);
            $table->dropIndex(['type']);
        });

        Schema::table('citations', function (Blueprint $table) {
            $table->dropIndex(['lawyer_id', 'starts_at']);
        });
    }
};

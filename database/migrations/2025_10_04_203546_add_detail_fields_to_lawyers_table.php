<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('lawyers', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->string('title')->nullable()->after('profession'); // e.g., "Abogado Senior"
            $table->text('bio')->nullable()->after('description'); // Extended biography
            $table->json('education')->nullable(); // Array of education entries
            $table->json('experience')->nullable(); // Array of work experience
            $table->json('specializations')->nullable(); // Array of specialization areas
            $table->json('achievements')->nullable(); // Array of achievements/awards
            $table->json('social_media')->nullable(); // Social media links
            $table->string('linkedin')->nullable();
            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            $table->string('instagram')->nullable();
            $table->integer('years_experience')->nullable();
            $table->integer('cases_won')->nullable();
            $table->string('office_location')->nullable();
            $table->text('office_hours')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0); // For sorting
        });
    }

    public function down(): void
    {
        Schema::table('lawyers', function (Blueprint $table) {
            $table->dropColumn([
                'slug',
                'title',
                'bio',
                'education',
                'experience',
                'specializations',
                'achievements',
                'social_media',
                'linkedin',
                'facebook',
                'twitter',
                'instagram',
                'years_experience',
                'cases_won',
                'office_location',
                'office_hours',
                'is_featured',
                'order',
            ]);
        });
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('lawyers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->nullable()->unique();
            $table->string('profession');
            $table->text('description')->nullable();
            $table->string('title')->nullable();
            $table->text('bio')->nullable();
            $table->json('education')->nullable();
            $table->json('experience')->nullable();
            $table->json('specializations')->nullable();
            $table->json('achievements')->nullable();
            $table->json('social_media')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('facebook')->nullable();
            $table->string('twitter')->nullable();
            $table->string('instagram')->nullable();
            $table->integer('years_experience')->nullable();
            $table->integer('cases_won')->nullable();
            $table->string('office_location')->nullable();
            $table->text('office_hours')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);
            $table->string('phone');
            $table->string('email')->unique();
            $table->string('image')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lawyers');
    }
};

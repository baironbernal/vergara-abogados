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
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('thumbnail')->nullable();
            $table->json('gallery')->nullable();
            $table->string('price');
            $table->decimal('size', 8, 2)->nullable();
            $table->text('description')->nullable();
            $table->foreignId('state_id')->constrained('states');
            $table->foreignId('municipality_id')->constrained('municipalities');
            $table->json('seo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};

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
        Schema::create('information', function (Blueprint $table) {
            $table->id();
            $table->string('corporative_email')->nullable();
            $table->string('corporative_whatsapp')->nullable();
            $table->string('corporative_linkedin')->nullable();
            $table->string('corporative_instagram')->nullable();
            $table->string('corporative_facebook')->nullable();
            $table->string('corporative_twitter')->nullable();
            $table->string('copyright_text')->nullable();
            $table->text('office_address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('information');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Previously stored as string — incorrect type.
            // decimal(15,2) supports values up to 9.999 trillion, sufficient for COP prices.
            $table->decimal('price', 15, 2)->change();
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('price')->change();
        });
    }
};

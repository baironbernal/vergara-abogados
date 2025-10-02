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
        Schema::table('citations', function (Blueprint $table) {
            $table->boolean('blocked_by_user')->default(false)->after('observations');
            $table->foreignId('blocked_by_user_id')->nullable()->constrained('users')->nullOnDelete()->after('blocked_by_user');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('citations', function (Blueprint $table) {
            $table->dropForeign(['blocked_by_user_id']);
            $table->dropColumn(['blocked_by_user', 'blocked_by_user_id']);
        });
    }
};

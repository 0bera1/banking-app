"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'banking_app',
    password: 'postgres',
    port: 5432,
});
async function runMigration(client, file) {
    try {
        await client.query('BEGIN');
        const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`Migration ${file} completed successfully`);
    }
    catch (error) {
        await client.query('ROLLBACK');
        if (error.code === '42710' || error.code === '42P07') {
            console.log(`Migration ${file} skipped (already exists)`);
            return;
        }
        throw error;
    }
}
async function runMigrations() {
    const client = await pool.connect();
    try {
        const migrationFiles = fs.readdirSync(path.join(__dirname))
            .filter(file => file.endsWith('.sql'))
            .sort();
        for (const file of migrationFiles) {
            console.log(`Running migration: ${file}`);
            await runMigration(client, file);
        }
        console.log('All migrations completed successfully');
    }
    catch (error) {
        console.error('Migration failed:', error);
        throw error;
    }
    finally {
        client.release();
        await pool.end();
    }
}
runMigrations().catch(console.error);
//# sourceMappingURL=run-migrations.js.map
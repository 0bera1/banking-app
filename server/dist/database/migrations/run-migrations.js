"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const fs = require("fs");
const path = require("path");
async function runMigrations() {
    const client = new pg_1.Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'banking_app',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    });
    try {
        await client.connect();
        console.log('Connected to database');
        const migrationFiles = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.sql'))
            .sort();
        for (const file of migrationFiles) {
            console.log(`Running migration: ${file}`);
            const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
            await client.query(sql);
            console.log(`Migration ${file} completed successfully`);
        }
        console.log('All migrations completed successfully');
    }
    catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
    finally {
        await client.end();
    }
}
runMigrations();
//# sourceMappingURL=run-migrations.js.map
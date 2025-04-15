import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'banking_app',
    password: 'postgres',
    port: 5432,
});

async function runMigration(client: any, file: string) {
    try {
        await client.query('BEGIN');
        
        const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
        await client.query(sql);
        
        await client.query('COMMIT');
        console.log(`Migration ${file} completed successfully`);
    } catch (error) {
        await client.query('ROLLBACK');
        
        // Eğer tablo veya trigger zaten varsa hatayı görmezden gel
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
        // Migration dosyalarını al
        const migrationFiles = fs.readdirSync(path.join(__dirname))
            .filter(file => file.endsWith('.sql'))
            .sort();

        // Her migration dosyasını ayrı bir transaction içinde çalıştır
        for (const file of migrationFiles) {
            console.log(`Running migration: ${file}`);
            await runMigration(client, file);
        }

        console.log('All migrations completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations().catch(console.error); 
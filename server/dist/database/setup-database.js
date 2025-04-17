"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("./database.service");
const fs = require("fs");
const path = require("path");
async function setupDatabase() {
    const databaseService = new database_service_1.DatabaseService();
    const client = await databaseService.getClient();
    try {
        await databaseService.beginTransaction(client);
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schema);
        await databaseService.commitTransaction(client);
        console.log('Database schema created successfully');
    }
    catch (error) {
        await databaseService.rollbackTransaction(client);
        console.error('Error creating database schema:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
setupDatabase().catch(console.error);
//# sourceMappingURL=setup-database.js.map
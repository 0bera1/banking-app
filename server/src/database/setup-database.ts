import { DatabaseService } from './database.service';
import * as fs from 'fs';
import * as path from 'path';

async function setupDatabase() {
  const databaseService = new DatabaseService();
  const client = await databaseService.getClient();

  try {
    await databaseService.beginTransaction(client);

    // SQL dosyasını oku
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // SQL komutlarını çalıştır
    await client.query(schema);

    await databaseService.commitTransaction(client);
    console.log('Database schema created successfully');
  } catch (error) {
    await databaseService.rollbackTransaction(client);
    console.error('Error creating database schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

setupDatabase().catch(console.error); 
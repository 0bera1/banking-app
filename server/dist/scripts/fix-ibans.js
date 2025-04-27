"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database/database.service");
async function fixIbans() {
    const dbService = new database_service_1.DatabaseService();
    try {
        const query = "SELECT id, iban FROM accounts WHERE iban LIKE '%.%'";
        const result = await dbService.query(query);
        console.log(`Bulunan noktalı IBAN sayısı: ${result.rows.length}`);
        for (const row of result.rows) {
            const cleanIban = row.iban.replace(/\./g, '');
            const updateQuery = "UPDATE accounts SET iban = $1 WHERE id = $2";
            await dbService.query(updateQuery, [cleanIban, row.id]);
            console.log(`Düzeltilen IBAN: ${row.iban} -> ${cleanIban}`);
        }
        console.log('Tüm IBAN\'lar düzeltildi');
    }
    catch (error) {
        console.error('IBAN düzeltme hatası:', error);
    }
}
fixIbans();
//# sourceMappingURL=fix-ibans.js.map
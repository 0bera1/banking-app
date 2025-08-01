"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
let DatabaseService = class DatabaseService {
    constructor() {
        console.log('Initializing database connection with config:', {
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'banking_app',
            port: parseInt(process.env.DB_PORT || '5432')
        });
        this.pool = new pg_1.Pool({
            user: process.env.DB_USER || 'postgres',
            host: process.env.DB_HOST || 'localhost',
            database: process.env.DB_NAME || 'banking_app',
            password: process.env.DB_PASSWORD || 'postgres',
            port: parseInt(process.env.DB_PORT || '5432'),
        });
        this.initializePool();
    }
    initializePool() {
        this.pool.on('error', (err) => {
            console.error('Unexpected error on idle client', err);
        });
        this.pool.on('connect', () => {
            console.log('New client connected to database');
        });
    }
    async query(text, params) {
        const start = Date.now();
        try {
            console.log('Executing query:', text);
            console.log('With params:', params);
            if (!this.pool) {
                console.error('Database pool is not initialized');
                throw new Error('Veritabanı bağlantısı başlatılmadı');
            }
            const res = await this.pool.query(text, params);
            const duration = Date.now() - start;
            console.log('Query executed successfully', {
                text,
                params,
                duration,
                rowCount: res.rowCount
            });
            return res;
        }
        catch (error) {
            console.error('Error executing query:', {
                text,
                params,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
            throw error;
        }
    }
    async getClient() {
        return await this.pool.connect();
    }
    async beginTransaction(client) {
        await client.query('BEGIN');
    }
    async commitTransaction(client) {
        await client.query('COMMIT');
    }
    async rollbackTransaction(client) {
        await client.query('ROLLBACK');
    }
    async findOne(table, id) {
        const result = await this.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
        return result.rows[0];
    }
    async findAll(table) {
        const result = await this.query(`SELECT * FROM ${table}`);
        return result.rows;
    }
    async create(table, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const columnNames = columns.join(', ');
        const query = `
        INSERT INTO ${table} (${columnNames})
        VALUES (${placeholders})
        RETURNING *
    `;
        const result = await this.query(query, values);
        return result.rows[0];
    }
    async update(table, id, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const setClause = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');
        const query = `
        UPDATE ${table}
        SET ${setClause}
        WHERE id = $1
        RETURNING *
    `;
        const result = await this.query(query, [id, ...values]);
        return result.rows[0];
    }
    async delete(table, id) {
        await this.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
//# sourceMappingURL=database.service.js.map
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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const database_service_1 = require("../database/database.service");
let UsersService = class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(userData) {
        try {
            console.log('Creating user with data:', userData);
            const query = `
                INSERT INTO users 
                (username, email, password_hash, first_name, last_name, role)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *
            `;
            const values = [
                userData.username,
                userData.email,
                userData.password_hash,
                userData.first_name || '',
                userData.last_name || '',
                userData.role || 'user'
            ];
            console.log('Executing query:', query);
            console.log('With values:', values);
            const result = await this.databaseService.query(query, values);
            console.log('Query result:', result);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    }
    async remove(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        await this.databaseService.query(query, [id]);
    }
    async findOne(id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await this.databaseService.query(query, [id]);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('User not found');
        }
        return result.rows[0];
    }
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await this.databaseService.query(query, [email]);
        return result.rows[0];
    }
    async update(id, userData) {
        const fields = [];
        const values = [];
        let valueIndex = 1;
        Object.entries(userData).forEach(([key, value]) => {
            if (value !== undefined) {
                fields.push(`${key} = $${valueIndex}`);
                values.push(value);
                valueIndex++;
            }
        });
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        const query = `
            UPDATE users 
            SET ${fields.join(', ')}
            WHERE id = $${valueIndex}
            RETURNING *
        `;
        values.push(id);
        const result = await this.databaseService.query(query, values);
        if (!result.rows[0]) {
            throw new common_1.NotFoundException('User not found');
        }
        return result.rows[0];
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map
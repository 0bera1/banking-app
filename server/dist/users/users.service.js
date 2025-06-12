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
        const data = Object.assign(Object.assign({}, userData), { created_at: new Date(), updated_at: new Date() });
        return await this.databaseService.create('users', data);
    }
    async findOne(id) {
        const result = await this.databaseService.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }
    async update(id, userData) {
        const data = Object.assign(Object.assign({}, userData), { updated_at: new Date() });
        return await this.databaseService.update('users', id, data);
    }
    async remove(id) {
        await this.databaseService.delete('users', id);
    }
    async findByEmail(email) {
        const result = await this.databaseService.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [database_service_1.DatabaseService])
], UsersService);
//# sourceMappingURL=users.service.js.map
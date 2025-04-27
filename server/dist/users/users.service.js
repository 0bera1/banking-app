"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
class UsersService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    async create(userData) {
        return await this.databaseService.create('users', userData);
    }
    async remove(id) {
        await this.databaseService.delete('users', id);
    }
    async findOne(id) {
        return await this.databaseService.findOne('users', id);
    }
    async findByEmail(email) {
        const result = await this.databaseService.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }
    async update(id, userData) {
        return await this.databaseService.update('users', id, userData);
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map
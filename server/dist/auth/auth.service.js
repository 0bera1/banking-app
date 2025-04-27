"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(username, email, password, first_name, last_name) {
        try {
            console.log('Registering user:', { username, email, first_name, last_name });
            const hashedPassword = await this.hashPassword(password);
            console.log('Password hashed successfully');
            const user = await this.usersService.create({
                username,
                email,
                password_hash: hashedPassword,
                first_name,
                last_name
            });
            console.log('User created successfully:', user);
            const { password_hash } = user, result = __rest(user, ["password_hash"]);
            return result;
        }
        catch (error) {
            console.error('Error in register:', error);
            throw new Error('Error registering: ' + error.message);
        }
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (user && await bcrypt.compare(password, user.password_hash)) {
            const { password_hash } = user, result = __rest(user, ["password_hash"]);
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = {
            email: user.email,
            sub: user.id,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
    async verifyToken(token) {
        try {
            return this.jwtService.verify(token);
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
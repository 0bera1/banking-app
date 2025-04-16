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
exports.Account = exports.AccountStatus = exports.Currency = exports.CardType = exports.CardIssuer = exports.CardBrand = void 0;
const typeorm_1 = require("typeorm");
var CardBrand;
(function (CardBrand) {
    CardBrand["VISA"] = "visa";
    CardBrand["MASTERCARD"] = "mastercard";
    CardBrand["AMEX"] = "amex";
})(CardBrand || (exports.CardBrand = CardBrand = {}));
var CardIssuer;
(function (CardIssuer) {
    CardIssuer["BANK_A"] = "bank_a";
    CardIssuer["BANK_B"] = "bank_b";
    CardIssuer["BANK_C"] = "bank_c";
})(CardIssuer || (exports.CardIssuer = CardIssuer = {}));
var CardType;
(function (CardType) {
    CardType["CREDIT"] = "credit";
    CardType["DEBIT"] = "debit";
})(CardType || (exports.CardType = CardType = {}));
var Currency;
(function (Currency) {
    Currency["TRY"] = "TRY";
    Currency["USD"] = "USD";
    Currency["EUR"] = "EUR";
})(Currency || (exports.Currency = Currency = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["INACTIVE"] = "inactive";
    AccountStatus["BLOCKED"] = "blocked";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
let Account = class Account {
};
exports.Account = Account;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Account.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 16 }),
    __metadata("design:type", String)
], Account.prototype, "card_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Account.prototype, "card_holder_name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CardBrand
    }),
    __metadata("design:type", String)
], Account.prototype, "card_brand", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CardIssuer
    }),
    __metadata("design:type", String)
], Account.prototype, "card_issuer", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CardType
    }),
    __metadata("design:type", String)
], Account.prototype, "card_type", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Account.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Currency,
        default: Currency.TRY
    }),
    __metadata("design:type", String)
], Account.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AccountStatus,
        default: AccountStatus.ACTIVE
    }),
    __metadata("design:type", String)
], Account.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Account.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Account.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Account.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 26 }),
    __metadata("design:type", String)
], Account.prototype, "iban", void 0);
exports.Account = Account = __decorate([
    (0, typeorm_1.Entity)('accounts')
], Account);
//# sourceMappingURL=account.entity.js.map
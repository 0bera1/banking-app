# Banking App Server Mimarisi

## Dosya Oluşturma Sırası ve İşlevleri

### 1. Temel Yapılandırma Dosyaları
- `package.json`: Proje bağımlılıklarını ve script'leri tanımlar
- `tsconfig.json`: TypeScript yapılandırmasını içerir
- `nest-cli.json`: NestJS CLI yapılandırmasını içerir
- `docker-compose.yml`: PostgreSQL veritabanı için Docker yapılandırması

### 2. Veritabanı Migrasyonları
- `001_initial_schema.sql`: İlk veritabanı şemasını oluşturur
  - `accounts` tablosu: Kullanıcı hesaplarını tutar
  - `transactions` tablosu: Para transferlerini kaydeder
  - `users` tablosu: Kullanıcı bilgilerini tutar
  - `audit_logs` tablosu: Audit log kayıtlarını tutar
  - İndeksler ve trigger'lar tanımlanır
- `002_update_transactions.sql`: Transactions tablosuna description alanı ekler

### 3. Ana Modüller
- `app.module.ts`: Ana uygulama modülü
  - Diğer tüm modülleri birleştirir
  - Global servisleri tanımlar
  - ConfigModule'u global olarak yapılandırır

### 4. Veritabanı Modülü
- `database.module.ts`: Veritabanı bağlantısını yönetir
- `database.service.ts`: Veritabanı işlemlerini gerçekleştirir
  - PostgreSQL bağlantı havuzu yönetimi
  - Sorgu çalıştırma ve transaction yönetimi

### 5. Hesap Modülü
- `accounts.module.ts`: Hesap işlemleri modülü
- `accounts.service.ts`: Hesap işlemlerini yönetir
- `accounts.controller.ts`: Hesap API endpoint'lerini tanımlar
- `dto/create-account.dto.ts`: Hesap oluşturma veri transfer nesnesi

### 6. İşlem Modülü
- `transactions.module.ts`: İşlem modülü
- `transactions.service.ts`: İşlem işlemlerini yönetir
- `transactions.controller.ts`: İşlem API endpoint'lerini tanımlar
- `dto/create-transaction.dto.ts`: İşlem oluşturma veri transfer nesnesi
- `dto/get-transactions.dto.ts`: İşlem sorgulama veri transfer nesnesi
- `transaction-limits.module.ts`: İşlem limitleri modülü

### 7. Audit Modülü
- `audit.module.ts`: Audit log modülü
- `audit.service.ts`: Audit log işlemlerini yönetir
- `audit.controller.ts`: Audit log API endpoint'lerini tanımlar

### 8. Kullanıcı ve Kimlik Doğrulama Modülleri
- `users.module.ts`: Kullanıcı modülü
  - `users.service.ts`: Kullanıcı işlemlerini yönetir
  - `users.controller.ts`: Kullanıcı API endpoint'lerini tanımlar
  - `entities/user.entity.ts`: Kullanıcı veri modelini tanımlar
- `auth.module.ts`: Kimlik doğrulama modülü
  - `auth.service.ts`: Kimlik doğrulama işlemlerini yönetir
  - JWT token yönetimi
  - Kullanıcı doğrulama ve yetkilendirme

### 9. Döviz Kuru Modülü
- `exchange.module.ts`: Döviz kuru modülü
- `exchange.service.ts`: Döviz kuru işlemlerini yönetir
- Döviz kuru dönüşümleri ve hesaplamaları

### 10. Güvenlik ve Performans
- JWT tabanlı kimlik doğrulama
- Şifre hashleme (bcrypt)
- PostgreSQL bağlantı havuzu
- Audit logging
- Transaction limitleri
- Döviz kuru desteği

## Modüller Arası İlişkiler

1. `AppModule` tüm modülleri birleştirir
2. `DatabaseModule` diğer tüm modüllere veritabanı bağlantısı sağlar
3. `AccountsModule` ve `TransactionsModule` birbiriyle etkileşim halindedir
4. `AuditModule` tüm işlemleri loglar
5. `UsersModule` ve `AuthModule` kullanıcı yönetimi ve kimlik doğrulama işlemlerini yönetir

## Veri Akışı

1. Kullanıcı bir API isteği gönderir
2. İlgili controller isteği alır
3. Service katmanı iş mantığını uygular
4. DatabaseService veritabanı işlemlerini gerçekleştirir
5. AuditService tüm işlemleri loglar
6. Sonuç kullanıcıya döndürülür

## SOLID Prensipleri ve IoC Container Yapısı

### SOLID Prensipleri Uygulaması

1. **Single Responsibility Principle (SRP)**
   - `DatabaseService`: Sadece veritabanı bağlantısı ve sorgu işlemlerinden sorumlu
   - `AccountsService`: Sadece hesap işlemleri (oluşturma, silme, güncelleme) ile ilgilenir
   - `TransactionsService`: Sadece para transferi işlemlerini yönetir
   - `AuditService`: Sadece işlem loglarını tutar
   - Her controller sadece kendi endpoint'lerini yönetir

2. **Open/Closed Principle (OCP)**
   - `TransactionsService` içindeki `createTransaction` metodu genişletilebilir yapıda:
     ```typescript
     async createTransaction(createTransactionDto: CreateTransactionDto) {
       // Mevcut işlem mantığı
       // Yeni özellikler eklenebilir (örn: farklı para birimleri)
     }
     ```
   - `AuditService` log sistemi mevcut işlemlere dokunmadan genişletilebilir

3. **Liskov Substitution Principle (LSP)**
   - Tüm servisler `@Injectable()` decorator'ını kullanır
   - Tüm controller'lar `@Controller()` decorator'ını kullanır
   - Tüm DTO'lar benzer yapıda tanımlanmıştır

4. **Interface Segregation Principle (ISP)**
   - `CreateAccountDto` ve `CreateTransactionDto` ayrı ayrı tanımlanmıştır
   - Her servis kendi DTO'larını kullanır
   - `GetTransactionsDto` sadece sorgulama için gerekli alanları içerir

5. **Dependency Inversion Principle (DIP)**
   - `TransactionsService` constructor'ında bağımlılıklar:
     ```typescript
     constructor(
       private readonly databaseService: DatabaseService,
       private readonly auditService: AuditService,
     ) {}
     ```
   - `AccountsService` constructor'ında bağımlılık:
     ```typescript
     constructor(private readonly databaseService: DatabaseService) {}
     ```
   - Tüm servisler interface üzerinden değil, somut implementasyonlar üzerinden bağımlılık alır

### IoC Container Yapısı

1. **Dependency Injection (DI)**
   - `TransactionsModule` içinde bağımlılıklar:
     ```typescript
     @Module({
       imports: [DatabaseModule, AccountsModule, AuditModule],
       controllers: [TransactionsController],
       providers: [TransactionsService],
       exports: [TransactionsService]
     })
     ```
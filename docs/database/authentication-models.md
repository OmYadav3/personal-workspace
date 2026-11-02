# Authentication Database Models

**Project:** Personal Workspace
**Module:** Authentication & User Management
**Database:** PostgreSQL
**ORM:** Prisma 7.10.1
**Status:** Schema validated; migration pending

## 1. Overview

The authentication database manages user accounts, login sessions, email verification, password resets, and user preferences.

## 2. Database Models

### User
**Table:** `users`

Stores registered user information.

Key fields:
- `id`: UUID primary key
- `name`: User's name
- `username`: Unique username
- `email`: Unique email address
- `passwordHash`: Hashed password
- `emailVerifiedAt`: Email verification timestamp
- `status`: ACTIVE, SUSPENDED, DELETED
- `createdAt`, `updatedAt`: Audit timestamps

Relationships:
- One user has many sessions.
- One user has many email verification records.
- One user has many password reset records.
- One user has zero or one preference record.

### Session
**Table:** `sessions`

Tracks authenticated devices and refresh-token sessions.

Key fields:
- `id`: UUID primary key
- `userId`: Foreign key to User
- `refreshTokenHash`: Unique hashed refresh token
- `tokenFamilyId`: Groups related refresh tokens
- `deviceInfo`: Optional device information
- `expiresAt`: Session expiration timestamp
- `revokedAt`: Optional revocation timestamp
- `createdAt`, `updatedAt`: Audit timestamps

Security rules:
- Never store raw refresh tokens.
- Validate expiration and revocation on refresh.
- Implement refresh-token rotation and reuse detection in the authentication service.
- Limit active sessions according to product requirements.

### EmailVerification
**Table:** `email_verifications`

Stores email verification challenges.

Key fields:
- `id`: UUID primary key
- `userId`: Foreign key to User
- `codeHash`: Hashed verification code
- `attempts`: Number of verification attempts
- `expiresAt`: Expiration timestamp
- `consumedAt`: Timestamp when the code was used
- `createdAt`: Creation timestamp

Security rules:
- Never store raw OTP codes.
- Enforce expiration, attempt limits, resend cooldowns, and rate limits.
- Mark a code as consumed after successful verification.

### PasswordReset
**Table:** `password_resets`

Stores password recovery requests.

Key fields:
- `id`: UUID primary key
- `userId`: Foreign key to User
- `tokenHash`: Unique hashed reset token
- `expiresAt`: Expiration timestamp
- `usedAt`: Timestamp when the token was used
- `createdAt`: Creation timestamp

Security rules:
- Use cryptographically secure random reset tokens.
- Store only token hashes.
- Reject expired or previously used tokens.
- Invalidate relevant sessions after a password change.

### UserPreference
**Table:** `user_preferences`

Stores user-specific application preferences.

Key fields:
- `id`: UUID primary key
- `userId`: Unique foreign key to User
- `theme`: SYSTEM, LIGHT, DARK
- `timezone`: Preferred timezone
- `settings`: JSON configuration
- `createdAt`, `updatedAt`: Audit timestamps

A unique `userId` enforces a one-to-one relationship with User.

## 3. Database Relationships

```text
User (1)
├── Session (many)
├── EmailVerification (many)
├── PasswordReset (many)
└── UserPreference (0 or 1)
```

Each child record belongs to one user.

Foreign-key relationships use cascading deletion in the proposed schema. This policy must be reviewed before implementing account deletion and data-retention requirements.

## 4. Naming Conventions

- Prisma models use PascalCase.
- Prisma properties use camelCase.
- PostgreSQL tables and columns use snake_case.
- Primary keys use UUIDs.
- Timestamp properties use descriptive names such as `expiresAt`, `createdAt`, and `updatedAt`.

## 5. Migration Workflow

From `apps/api`:

### Format the schema

```bash
npx prisma format
```

### Validate the schema

```bash
npx prisma validate
```

**Result:** Both commands completed successfully on November 2, 2026.

### Create a migration for review

```bash
npx prisma migrate dev --name add_authentication_models --create-only
```

Inspect the generated `migration.sql` before applying it.

Expected changes:
- Create sessions
- Create email_verifications
- Create password_resets
- Create user_preferences
- Create the Theme enum
- Add required indexes and foreign keys

The migration must not unexpectedly drop or recreate the existing users table.

### Apply the migration

```bash
npx prisma migrate dev
```

### Check migration status

```bash
npx prisma migrate status
```

### Generate Prisma Client

```bash
npx prisma generate
```

## 6. Acceptance Criteria

- [x] Prisma schema formatted successfully
- [x] Prisma schema validated successfully
- [ ] Migration SQL generated and reviewed
- [ ] Migration applied successfully
- [ ] Database tables verified
- [ ] Prisma Client generated
- [ ] Database queries tested
- [ ] Authentication service implemented
- [ ] Unit and integration tests added

## 7. Future Improvements

- Login and logout across multiple devices
- Refresh-token rotation and reuse detection
- Email OTP resend and verification workflows
- Forgot-password and reset-password APIs
- Session listing and revocation
- Account suspension and soft deletion
- Security audit logging
- User preference management

## 8. Suggested Commit

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat(database): add authentication and user preference models"
```

Commit documentation separately if preferred:

```bash
git add ../../docs/database/authentication-models.md
git commit -m "docs(database): document authentication data models"
```

## 9. Next Development Phase

Implement the authentication module using the validated Prisma models.

Start with:
1. Prisma Client connection verification
2. Registration validation using Zod
3. Password hashing
4. User registration service
5. Email verification flow
6. API integration tests

# LockSphere - Password Manager

## Table of Contents


## About

LockSphere is a robust password management solution designed to securely store and manage your sensitive credentials. Built with NestJS and other modern technologies, LockSphere ensures your data remains protected while providing easy access when you need it.

## Database schema

```bash
https://drawsql.app/teams/aceiny/diagrams/lock-sphere
```

## API Documentation

```bash
# API documentation is auto-generated using Swagger and can be accessed at:
/api/docs
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node >= 16.x
npm >= 8.x
PostgreSQL >= 14
Redis >= 6.x
```

### Clonning 
```bash
$ git clone https://github.com/aceiny/lock-sphere.git
$ npm i -g @nestjs/cli
$ cd lock-sphere/
```

### Quick Start 🚀

#### server 
```bash
$ npm install
$ cp .env.development .env    # Configure your environment variables
$ nest start --watch
```

#### client
```bash
$ npm install
$ cp .env.development .env    # Configure your environment variables
$ npm run dev
```

### Environment Variables

#### Server Environment Variables  
```bash  
$(cat backend/.env.development)
```
#### Client Environment Variables
```bash  
$(cat backend/.env.development)
```

### Running the app

```bash
# development
$ nest start --watch || npm run dev

# production mode
$ npm run build 
```

## Project Structure

### Backend Structure (server/)

```bash
server/src/
├── auth/               # Authentication and authorization logic
├── user/               # User management
├── vault/              # Vault management (password storage)
├── category/           # Category management for vault entries
├── auth_log/           # Authentication logging
├── queue/              # Queue management (Bull)
├── mail/               # Email service
├── redis/              # Redis module for caching and session management
├── backup/             # Backup functionality
├── common/             # Shared utilities and middleware
├── config/             # Configuration files
├── abstract/           # Abstract classes
├── app.module.ts       # Main application module
└── main.ts             # Entry point of the application
```
### Client Structure (client/)
```bash
client/
├── app/                  # Next.js application directory
├── components/           # Reusable UI components
├── lib/                  # Utility functions and API helpers
├── constants/            # Constant data
├── styles/               # Global styles
├── public/               # Static assets
├── next.config.js        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```
## Features

### Vault Management
- **Secure Password Storage:** Encrypt and store user passwords and other sensitive information in a secure vault.
- **Category Management:** Organize vault entries into categories for easy access.
- **Password Generation:** Generate strong, random passwords using a customizable password generator.
    - Customizable password length.
    - Options for including uppercase letters, lowercase letters, numbers, and symbols.
- **Data Export:** Export vault data for backup and migration purposes.

### File Handling
- **Secure File Uploads:** Allow users to upload files securely using Multer.
- **Image Support:** Support uploading and storing images.
- **Size and Type Validation:** Validate file sizes and types to prevent malicious uploads.
- **Cloudinary Integration:** Leverage Cloudinary for image storage and manipulation.
- **Profile Picture Upload:** Allow users to upload and store profile pictures.

### Email System
- **Welcome Emails:** Send welcome emails to new users upon signup.
- **Login Emails:** Send email notifications to users upon successful login.
- **Password Reset Emails:** Send password reset emails to users who have requested a password reset.
- **Queue-Based Email Processing:** Use Bull queue to process emails asynchronously, improving performance and reliability.
- **Resend Integration:** Use Resend for sending emails.

### Security Measures
- **Strong Authentication:** Use Passport.js and custom guards to control access based on authentication.
- **Encryption:** Encrypt and hash all sensitive data, including passwords and vault entries.
- **Vulnerability Prevention:** Leverage security features built into NestJS, like Helmet, which helps configure secure HTTP headers to mitigate common attacks.
- **Input Validation:** Validate all user-provided data to prevent unexpected inputs or malicious code injection.
- **Rate Limiting:** Implement rate limiting to prevent brute-force attacks or denial-of-service attempts.
- **Zero-Knowledge Architecture:** Ensure that user data remains encrypted and secure at all times.
- **Regular Security Audits:** Conduct regular security audits to identify and address potential vulnerabilities.

### User Interface
- **Responsive Design:** Ensure the application is accessible and usable on a variety of devices.
- **Theme Support:** Allow users to customize the look and feel of the application with light and dark themes.
- **Intuitive Navigation:** Provide a clear and easy-to-use navigation system.
- **Settings Page:** Allow users to manage their account settings and preferences.
- **Activity Log:** Track user activity, such as logins and password changes.

### Data Management
- **Data Export:** Allow users to export their data in a secure format.
- **Data Backup:** Provide a mechanism for users to back up their data.
- **Data Import:** Allow users to import data from other password managers.

### Other Features
- **API Documentation:** Generate API documentation using Swagger.
- **Logging:** Log important events and errors for debugging and monitoring purposes.
- **Error Handling:** Implement global exception handling to gracefully handle errors and prevent application crashes.
- **Configuration:** Use environment variables to configure the application.
- **Testing:** Implement unit tests to ensure the quality and reliability of the code.

## Security Measures

- **Strong Authentication:** Employ Passport.js and custom guards to ensure secure access control.
- **Encryption:** Utilize bcrypt for password hashing and AES-256-GCM for encrypting sensitive data, including 2FA secrets and vault entries.
- **Vulnerability Prevention:** Leverage NestJS security features, such as Helmet, to configure secure HTTP headers and mitigate common attacks.
- **Input Validation:** Implement class-validator for validating all user-provided data to prevent malicious code injection and unexpected inputs.
- **Rate Limiting:** Implement throttler to prevent brute-force attacks and denial-of-service attempts.
- **Two-Factor Authentication (2FA):** Offer an extra layer of security with authenticator apps, featuring:
    - Time-based One-Time Password (TOTP) generation using otplib.
    - QR code generation for easy setup with authenticator apps.
    - Secure storage and encryption of 2FA secrets.
    - Rate limiting on challenge creation and verification to prevent abuse.
- **Regular Security Audits:** Conduct regular security audits to identify and address potential vulnerabilities.


## Technologies Used 🛠️

### Core Framework
- **NestJS** (v10.x) - Progressive Node.js framework
- **TypeScript** (v5.x) - Type-safe development
- **Node.js** (v16+) - Runtime environment
- **Next.js** (v16+) - Progressive Node.js framework

### Database & Storage
- **PostgreSQL** (v14+) - Primary database
- **Redis** (v6+) - Caching & queue management

### Authentication & Security
- **Passport.js** - Authentication middleware
- **bcrypt** (v5.x) - Password hashing
- **helmet** - HTTP security headers
- **throttler** - Rate limiting
- **express-session** - session library 

### Real-time & Communication
- **Bull** - Queue management
- **Resend** - Email service

### Validation & Documentation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation
- **Swagger/OpenAPI** - API documentation
- **cookie-parser** - HTTP cookie parsing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Docker** - Containerization

### Testing
- **Jest** - Unit testing

### Ui and styling 
- **Tailwindcss** - css class library
- **Shadcn** - ready componants library


## Contributing

1. Create feature branch
2. Commit changes
3. Open pull request
4. Follow code standards

## Deployment

1. Automated via GitHub Actions
2. Docker containerization
3. Deployment to personnel vps

## License

MIT

## Contributors

- Ahmed Yassine Zeraibi , yzeraibi2000@gmail.com
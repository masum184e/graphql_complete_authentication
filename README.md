# GraphQL Complete Authentication

## Introduction

<p align="justify">This GraphQL API is designed to manage user and admin data within an application. It offers a set of queries and mutations to interact with the data related to users and administrators. The API is responsible for user registration, authentication, profile management, and password reset functionalities, as well as admin authentication and profile retrieval. CRUD operations are employed for user and admin management. Additionally, the API includes features for email sending, facilitating essential communication with users, such as password reset emails, and file uploading, allowing users to personalize their profiles by uploading images.</p>

[Live Preview](https://graphql-complete-authentication.vercel.app/graphql) | [Postman Documentation](https://documenter.getpostman.com/view/27027258/2s9YkhgQ4H)

## Requirements

[Install Node On Your Device](https://nodejs.org/)

## How to Run

```
git clone https://github.com/masum184e/graphql_complete_authentication.git
cd graphql_complete_authentication
npm install
npx nodemon index.js
```

## API Structure

```bash
├─ config
│  ├─ databaseConnection.js   - handle MongoClient
│  ├─ emailSending.js         - configure nodemailer
│  ├─ enryptionDecryption.js  - handle AES encryption decryption
│  ├─ fileUpload.js           - handle stream for uploading 
│  └─ validation.js           - handle regular expression
│
├─ htmlEmailTemplates
│  └─resetPasswordLink.js     - html template sent for reset password link
│
├─ middleware
│  └─authentication.js        - handle header bearer token cookie authentication
│
├─ profilePicture             - store uploaded profile picture
│
├─ reslovers
│  ├─ admin.js                - handle admin abilities
│  ├─ index.js                - merge all resolver
│  └─ user.js                 - handle user abilities
│
├─ types
│  ├─ admin.js                - define admin abilities
│  ├─ index.js                - merge all types
│  └─ user.js                 - define admin abilities
│
├─ .env                       - store all environment variable
├─ .gitignore                 - store details about ingnored file by git
├─ index.js                   - serve the server
├─ package-lock.json          - configuration for server
├─ package.json               - configuration for server
├─ README.md                  - serve a details documentation
└─ vercel.json                - configuration for vercel
```

## Features

| Feature Name                   | Accessibility        |
| ------------------------------ | -------------------- |
| User Registration              | Public               |
| User Login                     | Public               |
| User Reset Password            | Public               |
| Single User Data By User Id    | Authorized Admin and User |
| Upload Profile Picture         | Authorize User        |
| Admin Login                    | Public               |
| Single Admin Data By Admin Id  | Authorized Admin     |
| All User Data                  | Authorized Admin     |
| Remove User                    | Authorized Admin     |

## Features Details

**User Registration:** User can register with his first name, last name, email, phone number and password. Hashed password will store in the database, others field remain same. API can validate each field. User can use one email and one mobile number only once, duplicate account is not allowed.

**User Login:** Register user can login with mobile number or email and password. API will compare the password with the stored hashed password.

**User Reset Password:** User can reset password by giving registered email. A password reset email link will sent his email. This link is generated by `AES` algorithm. After visiting this link, API check the link is modified or not then user can reset password and API stored again hashed version of new password.

**Upload Profile Picture:** Authorize user can upload profile picture(*png/jpeg*). Uploaded picture file name will store in the database and file will stored in *profilePicture* folder in API structure.

**User Details:** Authorized admin can see details of any user by user's userId and authorized user can see only details of itself by his userId

**Admin Login:** Admin can login with email and password. Admin account should be created from database.

**Admin Details:** Authorized admin can see details of itself by his adminId. One admin can't see other admin details.

**User List:** Authorized admin can see a list of all register user.

**Remove User:** Authorized amdin can remove a user by his userId

## Environment Variables

| Configuration Key         | Value                                                                                      |
| ------------------------- |--------------------------------------------------------------------------------------------|
| PORT                      | specifies the port on which the server will listen for incoming connections                |
| DATABASE_NAME             | specifies the name of the database                                                         |
| DATABASE_URL              | specifies the URL or connection string for the MongoDB database                            |
| SMTP_HOST                 | specifies the SMTP server host for sending email                                           |
| SMTP_PORT                 | specifies the SMTP server port                                                             |
| SMTP_USER                 | specifies the email address from which email will sent                                     |
| SMTP_PASSWORD             | specifies the  app password associated with the SMTP_USER email address for authentication |
| BCRYPT_GEN_SALT_NUMBER    | specifies the number of rounds to use for generating a BCrypt salt                         |
| JWT_SECRET_KEY            | specifies the secret key used for signing and verifying JWTs                               |
| TOKEN_EXPIRES             | specifies the expiration time for JWT tokens                                               |
| PROFILE_PICTURE_PATH      | specifies the file path where profile pictures are saved                                   |
| PROFILE_PICTURE_MAX_SIZE  | specifies the maximum allowed size for profile pictures                                    |

## Email Sending
<p>When a user forgets his password, he can reset it by providing his email address. An email will be sent to his email address containing a reset password link. The API uses the <code>nodemailer</code> package to send an HTML template as an email.</p>

## Security
- **bcrypt:** password is hashed using <code>bcrypt</code>
- **crypto & AES:** <code>crypto</code>, as well as the AES algorithm, are used to secure the password reset link.

## GraphQL

| Query          | Mutation                   |
| -------------- | -------------------------- |
| users          | userLogin                  |
| user           | userRegistration           |
| admin          | userUploadProfilePicture   |
|                | userResetPasswordSendEmail |
|                | userResetPassword          |
|                | adminLogin                 |
|                | removeUser                 |

## CRUD Operations

**Create (C):**

- **User Registration:** The API allows users to create an account by providing their first name, last name, email, phone number, and password. When users register, a new user document is created in the database.

**Read (R):**

- **Query Resolvers:** The API provides query resolvers (*user* for user and admin, also *admin* and *users* for admins) to retrieve user and admin data from the database. These resolvers enable reading user and admin profiles based on their IDs.

**Update (U):**

- **User Profile Management:** Authrorized user can update their profile profile picture. When authorized users update their profiles, the API modifies their existing user records in the database to reflect the changes.
- **User Reset Password:** When user forgot his password, a reset password link is sent to his provided email. By clicking on that link he will be capable to update his password.

**Delete (D):**

- **Remove User:** Admins have the capability to delete user accounts using the *removeUser* mutation. This operation deletes the user's document from the database.

## Dependencies

| Package Name          |  Description                                                                 |
| ----------------------|------------------------------------------------------------------------------|
| apollo-server-express | build GraphQL server                                                         |
| graphql-upload        | handle file upload in graphql                                                |
| nodemailer            | send email                                                                   |
| zxcvbn                | check the strength of password                                               |
| mongodb               | NoSQL database                                                               |
| bcrypt                | hash and manage password                                                     |
| jsonwebtoken          | securely authenticate users and share information                            |
| crypto                | perform cryptographic  task while sending reset password link                |
| cors                  | secure cross-origin requests and data transfers between browsers and servers |
| dotenv                | load environment variables                                                   |
| express               | provides a robust set of features for web and mobile applications            |

# GraphQL Complete Authentication

## Introduction

<p align="justify">This GraphQL API is designed to manage user and admin data within an application. It offers a set of queries and mutations to interact with the data related to users and administrators. The API is responsible for user registration, authentication, profile management, and password reset functionalities, as well as admin authentication and profile retrieval. CRUD operations are employed for user and admin management. Additionally, the API includes features for email sending, facilitating essential communication with users, such as password reset emails, and file uploading, allowing users to personalize their profiles by uploading images.</p>

## Requirements

[Install Node On Your Device](https://nodejs.org/)

## How to Run

```
npm install
node index.js
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

## CRUD Operations

**Create (C):**

- **User Registration:** The API allows users to create an account by providing their first name, last name, email, phone number, and password. When users register, a new user document is created in the database.

**Read (R):**

- **Query Resolvers:** The API provides query resolvers (user and users for users, and admin for admins) to retrieve user and admin data from the database. These resolvers enable reading user and admin profiles based on their IDs.

**Update (U):**

- **User Profile Management:** Users can update their profile profile picture. When users update their profiles, the API modifies their existing user records in the database to reflect the changes.
- **User Reset Password:** When user forgot his password, a reset password link is sent to his provided email, here user have to update his password.

**Delete (D):**

- **Remove User:** Admins have the capability to delete user accounts using the removeUser mutation. This operation deletes the user's document from the database.

## Environment Variables

| Configuration Key         | Value                |
| ------------------------- |----------------------|
| PORT                      |                      |
| DATABASE_NAME             |                      |
| DATABASE_URL              |                      |
| SMTP_HOST                 |                      |
| SMTP_PORT                 |                      |
| SMTP_USER                 |                      |
| SMTP_PASSWORD             |                      |
| BCRYPT_GEN_SALT_NUMBER    |                      |
| JWT_SECRET_KEY            |                      |
| TOKEN_EXPIRES             |                      |
| PROFILE_PICTURE_PATH      |                      |
| PROFILE_PICTURE_MAX_SIZE  |                      |


# GraphQL Complete Authentication

## Introduction

This GraphQL API is designed to manage user and admin data within an application. It offers a set of queries and mutations to interact with the data related to users and administrators. The API is responsible for user registration, authentication, profile management, and password reset functionalities, as well as admin authentication and profile retrieval. CRUD operations are employed for user and admin management. Additionally, the API includes features for email sending, facilitating essential communication with users, such as password reset emails, and file uploading, allowing users to personalize their profiles by uploading images.

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



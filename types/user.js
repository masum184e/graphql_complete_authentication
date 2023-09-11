import { gql } from "apollo-server-express";

const userTypeDefs = gql`
  scalar Date
  scalar ID
  scalar Upload

  type User{
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    createdAt: Date!
    profilePicture: Upload
  }

  type Query{
    user(userId: ID!): User!
    users: [User!]
  }

  type Mutation{
    userRegistration(firstName: String!,lastName: String!,email: String!,phoneNumber: String!,password: String!): String!
    userLogin(email: String!, password: String!): String!
    removeUser(userId: ID!): Boolean!
    userResetPasswordSendEmail(email: String!): Boolean!
    userResetPassword(userId: ID, token: String!, password: String!): Boolean!
    userUploadProfilePicture(userId: ID, profilePicture: Upload): Boolean!
  }
`;

export default userTypeDefs;
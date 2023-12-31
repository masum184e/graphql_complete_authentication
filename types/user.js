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
    userLogin(identifier: String!, password: String!): String!
    removeUser(userId: ID!): Boolean!
    userUploadProfilePicture(userId: ID!, profilePicture: Upload!): Boolean!
    userResetPasswordSendEmail(email: String!): Boolean!
    userResetPassword(secretKey: String!, token: String!, password: String!): Boolean!
  }
`;

export default userTypeDefs;
import { gql } from "apollo-server-express";

const adminTypeDefs = gql`
  scalar ID

  type Admin{
    _id: ID
    fullName: String!
    email: String!
    password: String!
  }

  type Query{
    admin(adminId: ID!): Admin
  }

  type Mutation{
    adminLogin(email: String!, password: String!): String!
    removeUser(userId: ID): Boolean!
  }
`;

export default adminTypeDefs;
import { gql } from "apollo-server-express";

const adminTypeDefs = gql`
  scalar ID

  type Admin{
    _id: ID!
    fullName: String!
    email: String!
  }

  type Query{
    admin(adminId: ID!): Admin!
  }

  type Mutation{
    adminLogin(email: String!, password: String!): String!
  }
`;

export default adminTypeDefs;
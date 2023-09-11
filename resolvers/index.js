import { mergeResolvers } from "@graphql-tools/merge";

import userResolvers from './user.js';
import adminResolvers from "./admin.js";

const resolvers = mergeResolvers([
  userResolvers,
  adminResolvers
]);

export default resolvers;
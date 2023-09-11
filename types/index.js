import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDefs from './user.js';
import adminTypeDefs from "./admin.js";

const typeDefs = mergeTypeDefs([
  userTypeDefs,
  adminTypeDefs
]);

export default typeDefs;
import { mergeTypeDefs } from "@graphql-tools/merge";

import userTypeDefs from './user.js';

const typeDefs = mergeTypeDefs([
  userTypeDefs
]);

export default typeDefs;
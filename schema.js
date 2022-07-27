const { loadFilesSync } = require("@graphql-tools/load-files")
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge")

const loadedTypes = loadFilesSync(`${__dirname}/**/*.typeDefs.js`);
const loadedResolvers = loadFilesSync(`${__dirname}/**/*.{mutations,queries,resolvers}.js`);

export const typeDefs = mergeTypeDefs(loadedTypes);
export const resolvers = mergeResolvers(loadedResolvers);

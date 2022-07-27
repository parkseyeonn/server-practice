import {gql} from 'apollo-server';

export default gql`
  type MutationResult {
    ok: Boolean!
    message: String
  }
  type User {
    id: Int!
    name: String!
    nickname: String!
    email: String!
    password: String!
    bio: String
    avatar: String
    createdAt: String!
    updatedAt: String!
  }
`;
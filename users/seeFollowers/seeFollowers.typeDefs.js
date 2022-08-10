import {gql} from 'apollo-server';

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    totalPages: Int
  }
  type Query {
    seeProfile(username: String!, page: Int!): SeeFollowersResult
  }
`;
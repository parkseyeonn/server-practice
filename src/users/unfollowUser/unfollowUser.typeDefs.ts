import {gql} from "apollo-server";

export default gql`
  type Mutation {
    unfollowUser(nickname: String!): MutationResponse!
  }
`;
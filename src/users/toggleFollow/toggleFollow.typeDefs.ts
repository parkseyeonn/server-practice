import { gql } from "apollo-server";

export default gql`
  type Mutation {
    toggleFollow(nickname: String!): MutationResponse!
  }
`;
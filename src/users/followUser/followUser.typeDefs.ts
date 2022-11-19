import {gql} from "apollo-server";

export default gql`
  type Mutation {
    followUser(nickname: String!): MutationResponse!
  }
`;
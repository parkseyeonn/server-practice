import {gql} from "apollo-server";

export default gql`
  type MutationResponse {
    success: Boolean!
    message: String
  }
`;
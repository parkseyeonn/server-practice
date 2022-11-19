import { gql } from "apollo-server";

//todo https://github.com/apollographql/apollo-server/issues/1317#issuecomment-403648624
export default gql`
  scalar Upload
  type Mutation {
    uploadPhoto(file: Upload!, caption: String): Photo
  }
`;
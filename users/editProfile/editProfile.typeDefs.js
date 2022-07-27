import {gql} from 'apollo-server';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'

export default gql`
  type Upload {
    ${GraphQLUpload}
  }
  type Mutation {
    editProfile (
      name: String
      usernmae: String
      email: String
      password: String
      bio: String
      avatar: Upload
    ): MutationResult
  }
`;
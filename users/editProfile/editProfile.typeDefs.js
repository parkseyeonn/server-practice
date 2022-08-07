import {gql} from 'apollo-server';

export default gql`
  scalar Upload
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
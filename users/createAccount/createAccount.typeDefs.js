import {gql} from 'apollo-server';

export default gql`
  type Mutation {
    createAccount(
      name: String!
      nickName: String!
      email: String!
      password: String!
    ): MutationResult!
  }
`;
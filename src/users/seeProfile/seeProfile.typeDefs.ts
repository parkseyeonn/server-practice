import {gql} from 'apollo-server';

export default gql`
  type Query {
    seeProfile(nickname: String!): User
  }
`;
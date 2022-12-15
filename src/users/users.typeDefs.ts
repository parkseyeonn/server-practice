import {gql} from 'apollo-server';

export default gql`
  type User {
    id: Int!
    name: String!
    nickname: String!
    email: String!
    password: String!
    bio: String
    createdAt: String!
    updatedAt: String!
    avatar: String
    following: [User]
    followers: [User]
    totalFollowing: Int!
    totalFollowers: Int!
    isMe: Boolean!
    isFollowing: Boolean!
    photos(page: Int!): [Photo]
  }
`;
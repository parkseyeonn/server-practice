import client from "../client";

export default {
  User: {
    totalFollowing: ({id}) => client.user.count({
      where: {
        followers: {
          some: {
            id
          }
        }
      }
    }),
    totalFollowers: ({id}) => client.user.count({
      where: {
        following: {
          some: {
            id
          }
        }
      }
    }),
    isMe: ({id}, _, {loggedInUser}) => {
      if(!loggedInUser) return false;
      return id === loggedInUser.id;
    },
    isFollowing: ({id}, _, {loggedInUser}) => {
      if(!loggedInUser) return false;
      return Boolean(client.user.count({
        where: {
          nickname: loggedInUser.nickname,
          following: {
            some: {
              id
            }
          }
        }
      }));
    },
    photos: ({id}, {page}) => client.user.findUnique({
      where: {id}
    }).photos({
      take: 5,
      skip: 5 * (page - 1)
    }),
  }
}
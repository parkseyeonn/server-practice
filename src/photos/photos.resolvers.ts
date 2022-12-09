import client from "../client";

export default {
  Photo: {
    user: ({userId}) => client.user.findUnique({where: {id: userId}}),
    hashtags: ({id}) => client.hashtag.findMany({
      where: {
        photos: {
          some: {
            id
          }
        }
      }
    }),
    likes: ({id}) => client.like.count({where: {photoId: id}}),
    commentNumber: async ({id}) => {
      // query optimization
      const comments = await client.photo.findUnique({
        where: { id }
      }).comments();
      return comments.length;
      // return client.comment.count({where: {photoId: id}})
    },
    comments: async ({id}) => {
      // query optimization
      const comments = await client.photo.findUnique({
        where: { id }
      }).comments({
        include: {
          user: true
        }
      });
      return comments;
      // return client.comment.findMany({
      //   where: { photoId: id },
      //   include: {user: true},
      // })
    },
    isMine: ({userId}, _, {loggedInUser}) => {
      if(!loggedInUser) return false;
      return userId === loggedInUser.id;
    },
    isLiked: async ({id}, _, {loggedInUser}) => {
      if(!loggedInUser) return false;
      // query optimization
      const liked = await client.photo.findFirst({
        where: {
          id,
          likes: {
            some: {
              userId: loggedInUser.id
            }
          }
        }
      })
      // const liked = await client.like.findUnique({
      //   where: {
      //     photoId_userId: {
      //       photoId: id,
      //       userId: loggedInUser.id
      //     }
      //   },
      //   select: {id: true}
      // });
      if (liked) return true;
      return false;
    }
  },
  // todo why photos return by client? page and loggedInUser will be used? 
  Hashtag: {
    photos: ({id}, {page}, {loggedInUser}) => client.hashtag.findUnique({
      where: {id}
    }).photos(),
    totalPhotos: ({id}) => client.photo.count({where: {hashtags: {some: {id}}}})
  },
}
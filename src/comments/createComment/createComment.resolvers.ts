import { Resolvers } from "../../types";
import { protectedResolvers } from "../../users/users.utils";

const resolvers: Resolvers = {
  Mutation : {
    createComment: protectedResolvers(
      async (_, {photoId, payload}, {loggedInUser, client}) => {
        const photo = await client.photo.findUnique({
          where: {
            id: photoId,
          },
          select: {
            id: true
          }
        });
        if (!photo) {
          return {
            ok: false,
            error: "photo not found"
          }
        }
        const comment = await client.comment.create({
          data: {
            payload,
            photo: {
              connect: {
                id: photo.id
              }
            },
            user: {
              connect: {
                id: loggedInUser.id
              }
            }
          },
        });
        return {
          ok: true,
          id: comment.id
        }
      }
    )
  }
}

export default resolvers;
import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";

export default {
  Mutation: {
    editCommnet: protectedResolvers(
      async (_, {id, payload}, {loggedInUser}) => {
        const comment = await client.comment.findUnique({
          where: {
            id
          },
          select: {
            userId: true,
          }
        });
        if (!comment) {
          return {
            ok: false,
            error: "Comment not found"
          }
        } else if (comment.userId !== loggedInUser.id) {
          return {
            ok: false,
            error: "not authorized"
          }
        } else {
          await client.comment.update({
            where: {
              id
            },
            data: {
              payload
            }
          });
          return {
            ok: true
          }
        }
      }
    )
  }
}
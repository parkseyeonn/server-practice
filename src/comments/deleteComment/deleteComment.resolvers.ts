import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";

export default {
 Mutation: {
  deleteComment: protectedResolvers(async (_, {id}, {loggedInUser}) => {
    const comment = await client.comment.findUnique({
      where: {id}
    });
    if (!comment) {
      return {
        ok: false,
        error: "comment not found"
      }
    } else if (comment.userId !== loggedInUser.id){
      return {
        ok: false,
        error: "not authorized"
      }
    } else {
      await client.comment.delete({
        where: {id}
      });
      return {
        ok: true
      }
    }
  })
 }
}
import client from "../../client";
import { protectedResolvers } from "../users.utils";

export default {
  Mutation: {
    unfollowUser: protectedResolvers(async (_, {nickname}, {loggedInUser}) => {
      const ok = await client.user.findUnique({where: {nickname}});
      
      if (!ok) {
        return {
          ok: false,
          error: "That user does not exist.",
        };
      }

      const isFollowing = await client.user.count({
        where: {id: loggedInUser.id},
        // todo fix
        // following: {some: {nickname}}
      });

      if (isFollowing === 0) {
        return {
          ok: false,
          error: "You've already unfollowed the user",
        };
      }

      await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          following: {
            disconnect: {
              nickname
            }
          }
        }
      });

      return {
        ok: true
      }
    })
  }
}
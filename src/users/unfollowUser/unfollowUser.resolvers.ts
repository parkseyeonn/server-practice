import client from "../../client";
import { protectedResolvers } from "../users.utils";

export default {
  Mutation: {
    unfollowUser: protectedResolvers(async (_, {nickname}, {loggedInUSer}) => {
      const ok = await client.user.findUnique({where: {nickname}});
      
      if (!ok) {
        return {
          ok: false,
          error: "That user does not exist.",
        };
      }

      const isFollowing = await client.user.count({
        where: {id: loggedInUSer.id},
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
          id: loggedInUSer.id,
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
import client from "../../client";
import { protectedResolvers } from "../users.utils";

export default {
  Mutation: {
    followUser: protectedResolvers(async (_, {nickname}, {loggedInUser}) => {
      const ok = await client.user.findUnique({where: {nickname}});
      
      if (!ok) {
        return {
          ok: false,
          error: "That user does not exist.",
        };
      }

      await client.user.update({
        where: {
          id: loggedInUser.id,
        },
        data: {
          following: {
            connect: {
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
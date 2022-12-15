import { protectedResolvers } from "../users.utils";

export default {
  Mutation: {
    toggleFollow: protectedResolvers(
      async (_, {nickname}, {client, loggedInUser}) => {
        const user = await client.user.findUnique({
          where: {nickname},
          select: {id: true},
        });
        if (!user) {
          return {
            ok: false,
            error: "유저가 존재하지 않습니다."
          }
        }
        const isFollowing = await client.user.count({
          where: {
            id: loggedInUser.id,
            following: {
              some: {
                nickname
              }
            }
          },
        });
        console.log('isFollowing', isFollowing);
        await client.user.update({
          where: {id: loggedInUser.id},
          data: {
            following: {
              [isFollowing ? 'disconnect' : 'connect']: {nickname}
            }
          }
        })
        return {
          ok: true
        }
      }
    )
  }
}
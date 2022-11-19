import client from '../../client';

export default {
  Query: {
    seeFollowers: async (_, {nickname, page}) => {
      const ok = await client.user.findUnique({
        where: {nickname},
        select: {id: true},
      });
      if (!ok) {
        return {
          ok: false,
          error: 'user not found'
        };
      }
      const followers = await client.user
        .findUnique({where: {nickname}})
        .followers({
          take: 5,
          skip: (page -1) * 5,
        });
      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: {nickname}
          }
        }
      });
      return {
        ok: true,
        followers,
        totalPages: Math.ceil(totalFollowers / 5)
      }
    }
  }
}
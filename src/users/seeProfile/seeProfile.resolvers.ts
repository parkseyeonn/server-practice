import client from '../../client';

export default {
  Query: {
    seeProfile: async (_, {nickname}) => {
      const user = client.user.findUnique({
        where: {nickname},
      });
      if (!user) {
        return {
          ok: false,
          message: '유저가 존재하지 않습니다.'
        }
      }
      return user;
    }
  }
}
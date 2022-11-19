import client from '../../client';

export default {
  Query: {
    searchUsers: (_, {keyword}) => client.user.findMany({
      where: {
        nickname: {
          startsWith: keyword.toLowerCase(),
        }
      },
    })
  }
}
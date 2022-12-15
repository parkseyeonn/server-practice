import pubsub from '../../pubsub';
import { NEW_MESSAGE } from '../../constants';
import { withFilter } from 'graphql-subscriptions';
import client from '../../client';
import { SubscriptionResolvers } from '../../types';

const resolvers: SubscriptionResolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: async (root, args, context, info) => {
        const room = await client.room.findFirst({
          where: {
            id: args.id,
            users: {
              some: {
                id: context.loggedInUser?.id
              }
            }
          },
          select: {id: true}
        });
        if (!room) {
          throw new Error('채팅방이 존재하지 않거나 접근 권한이 없습니다.');
        }
        // withFilter를 바로 실행한 결과를 return해줘야한다.
        return withFilter(
          () => pubsub.asyncIterator(NEW_MESSAGE),
          ({ roomUpdates }, { id }) => { // If second function returns true, then User will get updated data.
            return roomUpdates.roomId === id;
          },
        )(root, args, context, info);
      }
    }
  }
}

export default resolvers;
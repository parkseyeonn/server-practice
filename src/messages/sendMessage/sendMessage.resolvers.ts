import { Resolvers } from "../../types";
import { protectedResolvers } from "../../users/users.utils";
import pubsub from "../../pubsub";
import { NEW_MESSAGE } from "../../constants";

const resolvers: Resolvers = {
  Mutation: {
    sendMessage: protectedResolvers(
      async (_, {roomId, userId, payload}, {client, loggedInUser}) => {
        console.log("hi");
        let room = null;
        if (roomId) {
          room = await client.room.findUnique({
            where: { id: roomId },
            select: { id: true }
          });
          if (!room) {
            return {
              ok: false,
              error: "방이 존재하지 않습니다."
            }
          }
        } else {
          const user = await client.user.findUnique({
            where: {id: userId},
            select: {id: true}
          });
          if (!user) {
            return {
              ok: false,
              error: "유저가 존재하지 않습니다."
            }
          }
          room = await client.room.create({
            data: {
              users: {
                connect: [
                  {id: loggedInUser.id},
                  {id: userId}
                ]
              }
            },
            select: {id: true}
          });
        }
        const message = await client.message.create({
          data: {
            payload,
            user: {
              connect: {id: loggedInUser.id}
            },
            room: {
              connect: {id: roomId ? roomId : room.id}
            }
          }
        });
        pubsub.publish(NEW_MESSAGE, {
          roomUpdates: {...message}
        });
        return {
          ok: true,
        };
      }
    )
  }
}

export default resolvers;
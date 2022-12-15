import { Resolvers } from "../../types";
import { protectedResolvers } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRoom: protectedResolvers(
      (_, {roomId}, {client, loggedInUser}) => (
        client.room.findFirst({
          where: {
            id: roomId,
            users: {
              some: {
                id: loggedInUser.id
              }
            }
          }
        })
      )
    )
  }
};

export default resolvers;
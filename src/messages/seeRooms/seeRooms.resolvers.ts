import { Resolvers } from "../../types";
import { protectedResolvers } from "../../users/users.utils";

const resolvers: Resolvers = {
  Query: {
    seeRooms: protectedResolvers(
      (_, __, {client, loggedInUser}) => (
        client.room.findMany({
          where: {
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
}

export default resolvers;
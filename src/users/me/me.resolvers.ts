import client from "../../client";
import { protectedResolvers } from "../users.utils";

export default {
  Query: {
    me: protectedResolvers((_, __, {loggedInUser}) => {
      return client.user.findUnique({
        where: {
          id: loggedInUser.id,
        }
      })
    })
  }
}
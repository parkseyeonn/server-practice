import { hash } from "bcrypt";
import client from "../../client";
import { protectedResolvers } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
  Mutation: {
    uploadPhoto: protectedResolvers(
      async (_, {file, caption}, {loggedInUser}) => {
        let hashtagObj = [];
        if (caption) {
          hashtagObj = processHashtags(caption);
        }
        return client.photo.create({
          data: {
            file,
            caption,
            user: {
              connect: {
                id: loggedInUser.id,
              }
            },
            ...(hashtagObj.length && {
              hashtags: {
                connectOrCreate: hashtagObj
              }
            })
          }
        })
      }
    )
  }
}
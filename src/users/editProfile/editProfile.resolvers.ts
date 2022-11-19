import bcrypt from 'bcrypt';
import client from '../../client';
import { protectedResolvers } from '../users.utils';

const resolver = async (_, {name, email, nickname, password: newPassword, bio, avatar}, {loggedInUSer}) => {
  let avatarUrl = null;
  if (avatar) {
    const {filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUSer.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    //todo createWriteStream
    // const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename);
    // readStream.pipe(writeStream);
    avatarUrl = newFilename;
  }
  let hashedPassword = null;
  if (newPassword) {
    hashedPassword = bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUSer.id
    }, 
    data: {
      nickname,
      name,
      email,
      ...(hashedPassword && {password: hashedPassword}),
      ...(avatarUrl && {avatar: avatarUrl}),
    }
  })
  if (updatedUser.id) {
    return {
      ok: true,
    };
  } else {
    return {
      ok: false,
      message: "Could not update profile.",
    };
  }
}

export default {
  Mutation: {
    editProfile: protectedResolvers(resolver)
  }
}
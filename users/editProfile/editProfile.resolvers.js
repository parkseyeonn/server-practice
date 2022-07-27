import bcrypt from 'bcrypt';
import client from '../../client';
import { protectedResolvers } from '../users.utils';

const resolver = async (_, {name, email, username, password: newPassword, bio, avatar}, {loggedInUSer}) => {
  let hashedPassword = null;
  if (newPassword) {
    hashedPassword = bcrypt.hash(newPassword, 10);
  }
  const updatedUser = await client.user.update({
    where: {
      id: loggedInUSer.id
    }, 
    data: {
      username,
      name,
      email,
      ...(hashedPassword && {password: hashedPassword})
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
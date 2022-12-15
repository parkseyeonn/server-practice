import bcrypt from 'bcrypt';
import client from '../../client';

export default {
  Mutation: {
    createAccount: async (_, {name, email, nickname, password}) => {
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{nickname}, {email}]
          }
        });
        if (existingUser) {
          return {
            ok: false,
            error: "nickname or email already exists.",
          }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            name, nickname, email, password: hashedPassword
          }
        });
        return {
          ok: true,
        };
      } catch (e) {
        return {
          ok: false,
          error: "Cant create user.",
        };
      }
    }
  }
}
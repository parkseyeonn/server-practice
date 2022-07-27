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
            message: "해당 닉네임의 유저가 이미 존재합니다.",
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
          message: "계정을 생성할 수 없습니다.",
        };
      }
    }
  }
}
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Mutation: {
    login: async (_, {nickname, password}) => {
      const uniqueUser = client.user.findFirst({where: {nickname}});
      if (!uniqueUser) {
        return {
          ok: false,
          message: '유저가 존재하지 않습니다.'
        }
      }
      const isPasswordOk = await bcrypt.compare(password, (await uniqueUser).password);
      if (!isPasswordOk) {
        return {
          ok: false,
          message: '비밀번호를 확인해주세요.'
        }
      }
      const token = await jwt.sign({id: (await uniqueUser).id}, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      }
    }
  }
}
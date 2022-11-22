import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Mutation: {
    login: async (_, {nickname, password}) => {
      const uniqueUser = await client.user.findFirst({where: {nickname}});
      if (!uniqueUser) {
        return {
          ok: false,
          error: '존재하지 않는 유저입니다.'
        }
      }
      const isPasswordOk = await bcrypt.compare(password, uniqueUser.password);
      if (!isPasswordOk) {
        return {
          ok: false,
          error: '비밀번호를 확인해주세요.'
        }
      }
      const token = await jwt.sign({id: uniqueUser.id}, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      }
    }
  }
}
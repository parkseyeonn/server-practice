import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Mutation: {
    login: async (_, {username, password}) => {
      const user = client.user.findFirst({where: {username}});
      if (!user) {
        return {
          ok: false,
          message: '유저가 존재하지 않습니다.'
        }
      }
      const isPasswordOk = bcrypt.compare(password, user.password);
      if (!isPasswordOk) {
        return {
          ok: false,
          message: '비밀번호를 확인해주세요.'
        }
      }
      const token = await jwt.sign({id: user.id}, process.env.SECRET_KEY);
      return {
        ok: true,
        token,
      }
    }
  }
}
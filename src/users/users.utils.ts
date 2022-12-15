import jwt from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }
    const {id} = jwt.verify(token, process.env.SECRET_KEY);
    const user = await client.user.findUnique({where: {id}});
    if (user) {
      return user;
    }
    return null;
  } catch {
    return null;
  }
};

export const protectedResolvers = (resolver) => (root, args, context, info) => {
  if(!context.loggedInUser) {
    if (info.operation.operation === "query") {
      return null;
    }
    return {
      ok: false,
      error: 'please log in.'
    }
  }
  return resolver(root, args, context, info);
};
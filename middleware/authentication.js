import Jwt from 'jsonwebtoken';

const authentication = async (context) => {
  try {
    const { authorization } = context.headers;
    if (authorization && authorization.startsWith("Bearer")) {

      const authorizationToken = authorization.split(" ")[1];
      if (authorizationToken) {
        return Jwt.verify(authorizationToken, process.env.JWT_SECRET_KEY);
      } else {
        throw new Error("Something Went Wrong");
      }

    } else {
      throw new Error("Unauthorized User");
    }
  } catch (error) {
    throw error;
  }
}

export default authentication;
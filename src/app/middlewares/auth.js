import jwt from "jsonwebtoken";
import authConfig from "../../config/auth";

function authMiddlewares(request, response, next) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    return response.status(401).json({ error: "Token not provide" });
  }

  const token = authToken.split(" ")[1];

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw new Error();
      }

      request.userId = decoded.id;
      request.userName = decoded.name;
    });
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    return response.status(401).json({ error: "Token is valid" });
  }

  return next();
}

export default authMiddlewares;

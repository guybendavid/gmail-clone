import jwt from "jsonwebtoken";
const { SECRET_KEY } = process.env;

export = (context: any) => {
  let token;

  if (context.req?.headers?.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
  }

  if (SECRET_KEY) {
    jwt.verify(token, SECRET_KEY, (err: any, decodedToken: any) => {
      context.user = decodedToken;
    });
  }

  return context;
};
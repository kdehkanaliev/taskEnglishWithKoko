import jwt from "jsonwebtoken";

let generatorAccess = async (user) => {
  let token = await jwt.sign(
    { ...user, expiresIn: "15m" },
    process.env.SECRET_KEY,
  );
  return token;
};

let generatorRefresh = async (id) => {
  let token = await jwt.sign(
    { ...id, expiresIn: "1d" },
    process.env.REFRESH_SECRET_KEY,
  );
  return token;
};

export { generatorAccess, generatorRefresh };

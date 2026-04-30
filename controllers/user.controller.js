import bcrypt from "bcryptjs";
import { generatorAccess, generatorRefresh } from "../utils/token.util.js";
import userModel from "../schema/user.model.js";
import jwt from "jsonwebtoken";

let getAll = async (req, res, next) => {
  let users = await userModel.find();
  res.json({ users });
};

let register = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    let data = await userModel.findOne({ email });

    if (data) {
      throw new Error("Email oldin ishlatilgan");
    }

    let newUser = await userModel.create({
      email,
      password,
    });

    res.json({
      success: true,
      message: "user succesfully created",
      newUser,
    });
    await data.save();
  } catch (error) {
    next(error);
  }
};

let login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let data = await userModel.findOne({ email }).select("+password");
    if (!data) {
      throw new Error("Email yoki password hato");
    }
    if (!bcrypt.compare(password, data.password))
      throw new Error("Email yoki password hato");

    let access = await generatorAccess({ email: data.email });
    let refresh = await generatorRefresh({ email: data.email });

    let userData = data.toObject();

    userData = { ...userData, access, refresh };

    res.json({
      userData,
    });
  } catch (error) {
    next(error);
  }
};

let refresh = async (req, res, next) => {
  let refresh = req.headers.authorization.split(" ")[1];
  let user_id = jwt.verify(refresh, process.env.REFRESH_SECRET_KEY);
  let data = await userModel.findOne({ email: user_id.email });
  let accesToken = await generatorRefresh({ email: data.email });
  res.json({
    status: "succes",
    message: "succesfully created",
    newRefreshToken: accesToken,
  });
};

export { register, login, getAll, refresh };

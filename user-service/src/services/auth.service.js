const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const register = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const userObj = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || 'patient'
  };

  if (userObj.role === 'doctor' && userData.specialty) {
    userObj.specialty = userData.specialty;
  }

  const user = new User(userObj);
  return await user.save();
};


const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { user, token };
};

const getAll = async () => {
  return await User.find();
};


const getById = async (id) => {
  return await User.findById(id);
};

module.exports = { register, login, getAll, getById };

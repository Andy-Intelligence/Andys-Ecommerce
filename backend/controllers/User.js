const User = require("../models/User");
const bcrypt = require("bcryptjs");

//create or signup user
const createUser = async (req, res) => {
  // console.log('hello')
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json(error);
  }
};

// login user
const loginUser = async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
      );
    const token = await user.generateAuthToken();
    // user.tokens.push(token) 
    const { password, ...others } = user._doc;
    res.status(200).json({ others, token });
  } catch (error) {
    res.status(400).send(error);
  }
};

// logout User
const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

// logout from all devices
const logoutAllDevices = async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
};

//get all users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(201).json({ allUsers });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//get topVendors
const getTopVendors = async (req, res) => {
  try {
    const allTopVendors = await User.find({ isVendor: true }).sort({
      "vendor.rating": -1,
    }); /**.limit(100) */
    res.status(201).json({ allTopVendors });
  } catch (error) {
    res.status(500).json({ error });
  }
};

//get singleVendor
const getSingleVendor = async (req, res) => {
  const id = req.params.id;
  try {
    const singleVendor = await User.findById(id);
    if (singleVendor) {
      res.status(201).json({ singleVendor });
    } else {
      res.status(404).send({ message: "Vendor Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

//get singleUser
const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const singleUser = await User.findById(id);
    if (singleUser) {
      res.status(201).json({ singleUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

//delete singleUser
const deleteSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    const singleUser = await User.findById(id);
    if (singleUser) {
      if (singleUser.isAdmin) {
        res
          .status(404)
          .send({ message: "User is an Admin, cannot be deleted" });
        return;
      }
      await singleUser.remove();
      res.status(201).json({ message: "User deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

const userProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;

    if (user.isVendor) {
      user.vendor.name = req.body.vendorName || user.vendor.name;
      user.vendor.logo = req.body.vendorLogo || user.vendor.logo;
      user.vendor.description =
        req.body.vendorDescription || user.vendor.description;
    }
    if (password) {
      user.password = bcrypt.hashSync(password, 8);
    }

    const updatedUser = await user.save();

    res.status(201).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isSeller: updatedUser.isSeller,
      token,
      // token: generateToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: "User has no profile" });
  }
};

//update User
const updateUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isVendor = Boolean(req.body.isVendor);
      const updatedUser = await user.save();
      res.json({ message: "User Updated", user: updatedUser });
    }
  } catch (error) {
    res.status(404).json({ message: error });
  }
};

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  logoutAllDevices,
  getAllUsers,
  getTopVendors,
  getSingleVendor,
  getSingleUser,
  deleteSingleUser,
  userProfile,
  updateUser,
};

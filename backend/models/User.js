const mongoose = require("mongoose");
// const validator = require(‘validator’)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const ObjectID = mongoose.Schema.Types.ObjectId;


const userSchema = new mongoose.Schema(

  {
    products: {
      type: ObjectID,
      required: false,
      ref: "Product",
    },
    username: {
      type: String,
      required: true,
      trim: true,
      uniques: true,
      //   lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      //  validate( value ) {
      //        if( !validator.isEmail( value )) {
      //             throw new Error( ‘Email is invalid’ )
      //              }
      //         }
    },
    image: {
      type:String,
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
      trim: true,
      //     validate(value) {
      //        if( value.toLowerCase().includes(‘password’)) {
      //        throw new Error(‘password musn\’t contain password’)
      //       }
      //    }
    },
    isVendor: {
      type: Boolean,
      default: false,
    },
    vendor: {

      name: { type: String },
      logo: { type: String },
      description: { type: String },
      verified: {
        type: Boolean,
        default: false
      },
      rating: { type: Number, default: 0, required: true },
      numReviews: { type: Number, default: 0, required: true },
    },
    // tokens: [
    //   {
    //     token: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

//Generate auth token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const { _id, name, email, isAdmin, isVendor,image } = user;
  const userData = {
    _id,
    name,
    email,
    isAdmin,
    isVendor,
    image,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  // const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
  // user.tokens = user.tokens.concat({ token });
  // user.tokens = user.tokens.splice(0, token );
  // await user.save();
  return token;
};

//login in users
userSchema.statics.findByCredentials = async (_email, _password) => {
  const user = await User.findOne({ email: _email });
  const { _id, name, email, password, isAdmin, isVendor } = user;
  if (!user) {
    // res.status(404).json({ message: "You are not recognised" });
    throw new Error("Unable to log in");
  }
  const isMatch = bcrypt.compareSync(_password, password);
  console.log(isMatch);
  if (isMatch) {
    // console.log(user);
    // res.status(200).json({
    //   _id,
    //   name,
    //   email,
    //   isAdmin,
    //   isVendor,
    //   token,
    // });
    // res.status(200).json({ user });
    return user;
  } else {
    // res.status(401).json({ message: "Invalid email or password" });
    throw new Error("Unable to log in");
  }
  // return user;
};

//Hash plain password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;

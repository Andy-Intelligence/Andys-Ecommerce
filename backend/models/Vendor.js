const mongoose = require("mongoose");
// const validator = require(‘validator’)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const vendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Vendor = mongoose.model("Vendor", vendorSchema);
module.exports = Vendor;

const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;


const productSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectID,
      required: true,
      ref: "Vendor",
    },
    vendor: { type: ObjectID, ref: "User" },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    images: [String],
    brand: { type: String, required: true },
    productDescription: {
      type: String,
      required: true,
    },
    specification: [String],
    overview: {
      type: String,
    },
    category: {
      type: Array,
      required: true,
    },
    // category: {
    //    type: Array,
    //    required: true
    // },
    productInformation: {
      ASIN: { type: String },
      customerReviews: { type: String },
      bestSellersRank: { type: String },
      packageDimensions: { type: String },
      itemWeight: { type: String },
      dateFirstAvailable: { type: String },
      brand: { type: String },
      series: { type: String },
      itemModelNumber: { type: String },
      itemWeight: { type: String },
      productDimensions: { type: String },
      itemDimensionsLxWxH: { type: String },
      manufacturer: { type: String },
      language: { type: String },
      countryOfOrigin: { type: String },
    },
    productVideo: { type: Array },
    productVideoTitle: { type: String },
    color: { type: Array },
    availableColors: { type: Array },
    inStock: {
      type: Boolean,
      default: true,
    },
    slug: { type: String, required: true, unique: true },
    countInStock: { type: Number, required: true },
    // rating: { type: Number, required: true },
    rating: {
      type: mongoose.Mixed, // A mixed type object to handle ratings. Each star level is represented in the ratings object
      1: Number, //  the key is the weight of that star level
      2: Number,
      3: Number,
      4: Number,
      5: Number,
      get: function (r) {
        // r is the entire ratings object
        let items = Object.entries(r); // get an array of key/value pairs of the object like this [[1:1], [2:1]...]
        let sum = 0; // sum of weighted ratings
        let total = 0; // total number of ratings
        for (let [key, value] of items) {
          total += value;
          sum += value * parseInt(key); // multiply the total number of ratings by it's weight in this case which is the key
        }
        return Math.round(sum / total);
      },
      set: function (r) {
        if (!(this instanceof mongoose.Document)) {
          // only call setter when updating the whole path with an object
          if (r instanceof Object) return r;
          else {
            throw new Error("");
          }
        } else {
          // get the actual ratings object without using the getter which returns  an integer value
          // r is the ratings which is an integer value that represent the star level from 1 to 5
          if (r instanceof Object) {
            return r; // handle setting default when creating object
          }
          this.get("ratings", null, { getters: false })[r] =
            1 + parseInt(this.get("ratings", null, { getters: false })[r]);
          return this.get("ratings", null, { getters: false });
        } // return the updated ratings object
      },
      validate: {
        validator: function (i) {
          let b = [1, 2, 3, 4, 5]; // valid star levels
          let v = Object.keys(i).sort();
          return b.every(
            (x, j) => v.length === b.length && x === parseInt(v[j])
          );
        },
        message: "Invalid Star Level",
      },
      default: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1 },
    },
    numReviews: { type: Number, required: true },
    reviews: [{ type: ObjectID, ref: "Review" }],
    price: {
      type: Number,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },/**this featured also means best selling. Featured products are typically best-selling, 
    well-reviewed, or brand new products that are shown on the homepage of an eCommerce site. i will write a logic to determine this */
    shipping: {
      type: Boolean,
      default: false,
    },
    stock: {
      type: Number,
      required: [true, 'Please enter product stock'],
      // maxLength: [4, 'stock cannot exceed 4 characters'],
      min: 0,
      default: 1,
    },
    // justIn: {
    //   type: Boolean,
    //   default: true,
    // },  ######using the createdAt to determine if a product is new or not has replaced this



  },
  {
    timestamps: true,
  },
  { toObject: { getters: true }, toJSON: { getters: true } }
);

const Product = mongoose.model("Product", productSchema);
// const Review = mongoose.model("Review", reviewSchema);
module.exports = Product;

// exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: false }]

// newDay.exercises.push(newExercise._id);






// images: [
//   {
//     public_id: {
//       type: String,
//       required: true,
//     },
//     url: {
//       type: String,
//       required: true,
//     },
//   },
// ],
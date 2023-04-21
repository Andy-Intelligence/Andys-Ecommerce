const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;


const reviewSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        comment: { type: String, required: true },
        rating: { type: Number },
        images: [String],
        image: { type: String },
    },
    {
        timestamps: true,
    }
);



const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;

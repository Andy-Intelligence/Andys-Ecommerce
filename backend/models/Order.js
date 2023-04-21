const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        slug: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    // products: [
    //   {
    //     productId: {
    //       type: ObjectID,
    //       ref: "Product",
    //       required: true,
    //     },
    //     name: String,
    //     quantity: {
    //       type: Number,
    //       required: true,
    //       min: 1,
    //       default: 1,
    //     },
    //     price: Number,
    //   },
    // ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    // address: {
    //   type: Object,
    //   required: true,
    // },
    // status: {
    //   type: String,
    //   default: "pending",
    // },
    shippingAddress: {
      fullName: { type: String, required: true },
      customerEmail: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
      location: {
        lat: Number,
        lng: Number,
        address: String,
        name: String,
        vicinity: String,
        googleAddressId: String,
      },
    },
    paymentMethod: { type: String, required: true },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    orderSubtotalInclTax: { type: Number, required: true },
    orderSubtotalExclTax: { type: Number, required: true },
    orderSubTotalDiscountInclTax: { type: Number, required: true },
    orderSubTotalDiscountExclTax: { type: Number, required: true },
    orderShippingInclTax: { type: Number, required: true },
    orderShippingExclTax: { type: Number, required: true },
    paymentMethodAdditionalFeeInclTax: { type: Number, required: true },
    paymentMethodAdditionalFeeExclTax: { type: Number, required: true },
    orderTax: { type: Number, required: true },
    orderTotal: { type: Number, required: true },
    paidAmount: { type: Number, required: true },
    refundedAmount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vendor: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;




















// const mongoose = require('mongoose');

// const orderSchema = mongoose.Schema({
//   shippingInfo: {
//     address: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     country: {
//       type: String,
//       required: true,
//     },
//     pinCode: {
//       type: Number,
//       required: true,
//     },
//     phoneNumber: {
//       type: Number,
//       required: true,
//     },
//   },
//   orderItems: [
//     {
//       name: {
//         type: String,
//         required: true,
//       },
//       price: {
//         type: Number,
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//       },
//       image: {
//         type: String,
//         required: true,
//       },
//       color: {
//         type: String,
//         required: true,
//       },
//       size: {
//         type: String,
//         required: true,
//       },
//       product: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Product',
//         required: true,
//       },
//     },
//   ],
//   user: {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//     },
//   },
//   paymentInfo: {
//     id: {
//       type: String,
//       required: true,
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//   },
//   paidAt: {
//     type: Date,
//     required: true,
//   },
//   itemsPrice: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   shippingPrice: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   totalPrice: {
//     type: Number,
//     required: true,
//     default: 0,
//   },
//   orderStatus: {
//     type: String,
//     required: true,
//     default: 'processing',
//   },
//   deliveredAt: Date,
//   createdAt: {
//     type: Date,
//     default: Date.now(),
//   },
// });

// module.exports = mongoose.model('Order', orderSchema);




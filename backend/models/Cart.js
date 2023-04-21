const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;


const cartSchema = new mongoose.Schema(
  {
    owner: {
      type: ObjectID,
      required: true,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: ObjectID,
          ref: "Product",
          required: true,
        },
        storeId: {
          type: ObjectID,
          ref: "Store",
          required: true,
        },
        warehouseId: {
          type: ObjectID,
          ref: "Warehouse",
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        price: { type: Number },
        isFreeShipping: {
          type: Boolean,
          default: false,
        },
        isShipEnabled: {
          type: Boolean,
          default: true,
        },
      },
    ],
    bill: {
      type: Number,
      required: true,
      default: 0,
    },
    shoppingCartTypeId: {
      type: Number,
      required: true,
      default: 1,
    },

    // StoreId: " ",
    // WarehouseId: null,
    // ShoppingCartTypeId: 1,
    // ProductId: " ",
    // Attributes: [],
    // EnteredPrice: null,
    // Quantity: 1,
    // RentalStartDateUtc: null,
    // RentalEndDateUtc: null,
    // CreatedOnUtc: ISODate("2021-07-29T09:56:46.732Z"),
    // UpdatedOnUtc: ISODate("2021-07-29T09:56:46.732Z"),
    // IsFreeShipping: false,
    // IsGiftVoucher: false,
    // IsShipEnabled: true,
    // AdditionalShippingChargeProduct: 0.0,
    // IsTaxExempt: false,
    // ReservationId: "",
    // Parameter: "",
    // Duration: "",
    // cId: null,
  },
  {
    timestamps: true,
  }
);



const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
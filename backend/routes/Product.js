const express = require("express");
const router = express.Router();

const {
  auth,
  isAuth,
  isAdmin,
  isVendor,
  isVendorOrAdmin,
} = require("../middlewares/Auth");

const {
  createProduct,
  updateProduct,

  getProducts,
  // postProduct,
  updateParticularProduct,
  deleteParticularProduct,
  postProductReview,
  getAdminProducts,
  searchProducts,
  productCategories,
  singleProduct,
  productslug,
  replaceRatingObject,
  increaseParticularStarLevel1,
  increaseParticularStarLevel2,
  replaceEntireRatingObject,
  getProductsBasedVendor,
  getProductsViaVendorID
} = require("../controllers/Product");

//createProduct
router.post("/createProduct", auth, createProduct);

//Fetch a singleProduct
router.get("/singleProduct/:id", singleProduct);

//Fetch all product also check for vendor querry
router.get("/getProducts", getProducts);



//Fetch all product based on vendorID
router.get("/getProductsViaVendorID/:id", getProductsViaVendorID);




//Fetch and getProductsBasedVendor
router.get("/getProductsBasedVendor", auth, getProductsBasedVendor);

//updateParticularProduct
router.put("/updateParticularProduct/:id", auth, updateParticularProduct);

//deleteParticularProduct
router.delete("/deleteParticularProduct/:id", auth, deleteParticularProduct);

//postProductReview
router.post("/:id/postProductReview", auth, postProductReview);

//replaceRatingObject
router.put("/:id/replaceRatingObject", auth, replaceRatingObject);

//increaseParticularStarLevel1
router.post(
  "/:id/increaseParticularStarLevel1",
  auth,
  increaseParticularStarLevel1
);

//increaseParticularStarLevel2
router.post(
  "/:id/increaseParticularStarLevel2",
  auth,
  increaseParticularStarLevel2
);

//replaceEntireRatingObject
router.post("/:id/replaceEntireRatingObject", auth, replaceEntireRatingObject);

// //get products
// router.get("/getProducts", auth, getProducts);

//postProduct
// router.post("/postProduct", auth, isVendorOrAdmin, postProduct);

// //updateParticularProduct
// router.patch(
//   "/updateParticularProduct",
//   auth,
//   isVendorOrAdmin,
//   updateParticularProduct
// );

// //deleteParticularProduct
// router.delete(
//   "/deleteParticularProduct/:id",
//   auth,
//   isAdmin,
//   deleteParticularProduct
// );

//getAdminProducts
router.get("/getAdminProducts", auth, isVendorOrAdmin, getAdminProducts);

//searchProducts
router.get("/searchProducts", searchProducts);

//productCategories
router.get("/productCategories", auth, productCategories);

router.get("/productslug/:slug", productslug);

module.exports = router;

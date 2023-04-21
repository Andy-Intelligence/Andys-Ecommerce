const express = require("express");
const router = express.Router();
const {
  auth,
  isAuth,
  isAdmin,
  isSeller,
  isSellerOrAdmin,
} = require("../middlewares/Auth");

 const {
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
 } = require("../controllers/User");






//signup route
router.post("/signup",createUser );

//login route
router.post("/login", loginUser);

//logout route
router.post("/logout", auth,logoutUser );

//logout from all devices that youre logged in
router.post("/logoutAll", auth,logoutAllDevices );

//getAll users
router.get("/getAllUsers", auth,isAdmin,getAllUsers );

//getTopVendors 
router.get("/getTopVendors", auth, getTopVendors);

//getSingleVendor 
router.get("/getSingleVendor", auth, getSingleVendor);

//getSingleUser
router.get("/getSingleUser/:id", auth,isAdmin, getSingleUser);

//deleteSingleUser
router.delete("/deleteSingleUser/:id", auth, isAdmin, deleteSingleUser);

//userProfile
router.put("/userProfile", auth, userProfile);

//updateUser
router.put("/updateUser", auth,isAdmin, updateUser);



module.exports = router;
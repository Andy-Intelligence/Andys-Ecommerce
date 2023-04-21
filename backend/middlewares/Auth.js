const jwt = require("jsonwebtoken");
const User = require("../models/User");



const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Authentication required" });
  }
};




// Register
// router.post('/register', async (req,res) =>{
//     const newUser = new User({
//         username: req.body.username,
//         email: req.body.email,
//         password:req.body.password
//     })

//     try {
//         const savedUser = await newUser.save();
//         res.send(201).json(savedUser)
//     }
//     catch (error) {
//         console.log(err)
//         res.status(500).json(err)
//     }
// })



  
 const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        req.token = token; /** sceptical */
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};



const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};


 const isVendor = (req, res, next) => {
  if (req.user && req.user.isVendor) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Vendor Token" });
  }
};



 const isVendorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isVendor || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin/Vendor Token" });
  }
};

module.exports = { auth ,isAuth,
isAdmin,
isVendor,
isVendorOrAdmin};
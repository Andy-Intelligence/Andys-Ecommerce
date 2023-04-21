const Product = require("../models/Product");
const Review = require('../models/Review')

//create an Product
const createProduct = async (req, res) => {
  
  try {
    console.log(req.body);
    const newProduct = new Product({
      ...req?.body,
      owner: req?.user?._id,
      vendor: req?.user?._id,
    });
    newProduct.productInformation.ASIN = req?.body?.productInformationASIN;
    newProduct.productInformation.customerReviews =
      req?.body?.productInformationcustomerReviews;
    newProduct.productInformation.bestSellersRank =
      req?.body?.productInformationbestSellersRank;
    newProduct.productInformation.packageDimensions =
      req?.body?.productInformationpackageDimensions;
    newProduct.productInformation.series = req?.body?.productInformationseries;
    newProduct.productInformation.itemModelNumber =
      req?.body?.productInformationitemModelNumber;
    newProduct.productInformation.productDimensions =
      req?.body?.productInformationproductDimensions;
    newProduct.productInformation.itemDimensionsLxWxH =
      req?.body?.productInformationitemDimensionsLxWxH;
    newProduct.productInformation.manufacturer =
      req?.body?.productInformationmanufacturer;
    newProduct.productInformation.language =
      req?.body?.productInformationlanguage;
    newProduct.productInformation.countryOfOrigin =
      req?.body?.productInformationcountryOfOrigin;
    newProduct.productInformation.dateFirstAvailable =
      req?.body?.productInformationdateFirstAvailable;
    newProduct.productInformation.itemWeight =
      req?.body?.productInformationitemWeight;

    await newProduct.save();
    res.status(201).json({ newProduct });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

//update a product
const updateProduct = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "description", "category", "price"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "invalid updates" });
  }
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).send();
    }
    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

//find product based on the owner
const getProductsBasedVendor = async (req, res) => {
  // const owner = req.params.id
const vendor = req.user.id
  console.log(req.user.id);
  try {
    const products = await Product.find({ owner:String(vendor) });

    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error });
  }
};

//find product and also based on seller if in query
const getProducts = async (req, res) => {
  const vendor = req.query.vendor || "";
  const vendorFilter = vendor ? { vendor: vendor } : {};

  try {
    const products = await Product.find({ ...vendorFilter }).lean().populate("reviews").populate({
     path: "vendor",
      populate: [
        "vendor.name",
        "vendor.logo",
        "vendor.description",
        "vendor.rating",
        "vendor.numReviews",
      ], 
      
    }
    )
      //.exec()


    console.log("eno",products[0].reviews[0])

    res.status(200).json({ products });
  } catch (error) {
    res.status(400).json({ error });
  }
};








//find product based on vendorID
const getProductsViaVendorID = async (req, res) => {
  const vendorID = req.params.id || "";
  // const vendorFilter = vendor ? { vendor: vendor } : {};

  try {
    const products = await Product.find({ owner: vendorID });


  
    res.status(200).json(products );
  } catch (error) {
    res.status(400).json({ error });
  }
};
















//update a product
const updateParticularProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    if (productId) {
      const product = await Product.findByIdAndUpdate(productId, req.body, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ product });
    } else {
      res.status(400).send({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).json({ error });
  }
};

//delete a product
const deleteParticularProduct = async (req, res) => {
  const productId = req.params.id;

  try {
    if (productId) {
      await Product.findByIdAndDelete(productId);
      res.status(200).json({ message: "Product Deleted" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(404).json({ error });
  }
};

//post a product review
const postProductReview = async (req, res) => {
  const productId = req?.params?.id;
 
  try {
    const product = await Product?.findById(productId);
    if (product) {
      
      if (product?.reviews?.find((x) => x?.name === req?.user?.username)) {
        return res
          .status(400)
          .json({ message: "You already submitted a review" });
      }

      const review = new Review({
        name: req?.user?.username,
        image: req?.user.image,
        rating: 4,
        comment: req?.body.comment,
        images: req?.body.images,
        title: "req?.body[title]",
      });

      // "https://miro.medium.com/fit/c/140/140/1*kMMtO2szrWyPTQBZP4ns8w.jpeg"
      console.log("review",review)
      // product.update({ $push: { "reviews": review} });
      // const updatedProduct =  product.reviews.populate("reviews",["reviews.name","reviews.image","reviews.rating","reviews.comment","reviews.images","reviews.title"]);
       review.save().then(() => {
         return Product.findByIdAndUpdate(productId,  {
          new: true,
          // runValidators: true,
        })
      }).then((product) => {
        product?.reviews?.unshift(review)


        console.log("andy",product)

        return product?.save(function (err, product, numAffected) {
          if (err) {
            res.status(400).json({err})
          }
          else {
            res.status(200).json({ product })
          }
})
      })

      
      // console.log("up",product)
      product.numReviews = product.reviews.length;

      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;

      // await product.save(updatedProduct);
      // console.log(updatedProduct)

      res.status(201).json({
        message: "Review Created",
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
        images: product.images,
        title: product.title,
        image: product.image,
      });
    } else {
      res.status(404).json({ message: "Product Not Found" });
    }
  } catch (error) {}
};

const PAGE_SIZE = 3;
//get product as admin
const getAdminProducts = async (req, res) => {
  const { query } = req;
  const page = query.page || 1;
  const pageSize = query.pageSize || PAGE_SIZE;
  const vendor = req.query.vendor || "";
  const vendorFilter = vendor ? { vendor } : {};

  try {
    const products = await Product.find({ ...vendorFilter })
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments();

    res.status(200).json({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  } catch (error) {
    res.status(200).json({ error });
  }
};

//search product
const searchProducts = async (req, res) => {
  try {
    const { query } = req;

    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || "";
    const price = query.price || "";
    const rating = query.rating || "";
    const order = query.order || "";
    const searchQuery = query.query || "";
    const qNew = query.new || "";

    if (qNew) {
      const products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    }
    const queryFilter =
      searchQuery && searchQuery !== "all"
        ? {
            title: {
              $regex: searchQuery,
              $options: "i",
            },
          }
        : {};

    const categoryFilter =
      category && category !== "all" ? { category: { $in: [category] } } : {};

    const ratingFilter =
      rating && rating !== "all"
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== "all"
        ? {
            // 1-50
            price: {
              $gte: Number(price.split("-")[0]),
              $lte: Number(price.split("-")[1]),
            },
          }
        : {};
    const sortOrder =
      order === "featured"
        ? { featured: -1 }
        : order === "lowest"
        ? { price: 1 }
        : order === "highest"
        ? { price: -1 }
        : order === "toprated"
        ? { rating: -1 }
        : order === "newest"
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });

    res.status(200).json({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  } catch (error) {
    res.status(200).json({ error });
  }
};

const productCategories = async (req, res) => {
  const categories = await Product.find().distinct("category");

  res.status(200).json({ categories });
};

const singleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("vendor", [
    "vendor.name",
    "vendor.logo",
    "vendor.description",
    "vendor.rating",
    "vendor.numReviews",
  ]);

  if (product) {
    // const weightedProductRating = product.get("rating", null, {
    //   getters: true,
    // });
    // res.status(200).json({ ...product._doc, weightedProductRating });
    res.status(200).json({ product });
  } else {
    res.status(404).send({ message: "Product not found." });
  }
};

const productslug = async (req, res) => {
  const product = await Product.findOne(
    { slug: req.params.slug },
    { runValidators: true }
  ).populate("vendor", [
    "vendor.name",
    "vendor.logo",
    "vendor.reviews",
    "vendor.numReviews",
    "vendor.description",
    "vendor.rating",
  ]);

  console.log(product);

  if (product) {
    res.status(200).json({ product });
  } else {
    res.status(404).send({ message: "Product not found." });
  }
};

const replaceRatingObject = async (req, res) => {
  // replace the entire rating object
  // this should run successfully
  const productId = req.params.id;
  let prod = await Product.findById(productId);
  prod.rating = { 1: 1, 2: 1, 3: 1, 4: 30, 5: 1 };
  prod.markModified("rating"); // Add markModified because ratings is a mixed object type
  prod.save();
  console.log(prod.get("rating", null, { getters: true }));
  console.log(prod);
  res.status(200).json({ prod });
};

const increaseParticularStarLevel1 = async (req, res) => {
  // increment a particular star level.
  // by assigning directly to the ratings object
  const productId = req.params.id;
  let prod = await Product.findById(productId);
  prod.rating = 5;
  prod.markModified("rating"); // Add markModified because ratings is a mixed object type
  prod.save();
  console.log(prod.get("rating", null, { getters: false }));
  console.log(prod);
  res.status(200).json({ prod });
};

const increaseParticularStarLevel2 = async (req, res) => {
  // increment a particular star level.
  // this should run successfully
  const productId = req.params.id;
  const ratingProp = req.body.ratingProp;
  console.log("ratingProp", ratingProp);
  const key = `rating.${ratingProp}`;
  const prod = await Product.findByIdAndUpdate(
    productId,
    { $inc: { [key]: 1 } },
    { new: true }
  );
  console.log(prod.get("rating", null, { getters: true }));
  console.log(prod);
  res.status(200).json({ prod });
};

const replaceEntireRatingObject = async (req, res) => {
  // replace the entire rating object
  // this should run successfully
  const productId = req.params.id;
  let prod = await Product.findByIdAndUpdate(
    productId,
    { $inc: { [key]: 1 } },
    { new: true },
    { rating: { 1: 3, 2: 1, 3: 1, 4: 1, 5: 1 } }
  );
  console.log(prod.get("rating", null, { getters: false }));
  console.log(prod);
};

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
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
};








//post a product review
// const postProductReview = async (req, res) => {
//   const productId = req?.params?.id;

//   try {
//     const product = await Product?.findById(productId);
//     if (product) {

//       if (product?.reviews?.find((x) => x?.name === req?.user?.username)) {
//         return res
//           .status(400)
//           .json({ message: "You already submitted a review" });
//       }

//       const review = new Review({
//         name: req?.user?.username,
//         image: req?.user.image,
//         rating: 4,
//         comment: req?.body.comment,
//         images: req?.body.images,
//         title: "req?.body[title]",
//       });

//       // "https://miro.medium.com/fit/c/140/140/1*kMMtO2szrWyPTQBZP4ns8w.jpeg"
//       console.log("review", review)
//       // product.update({ $push: { "reviews": review} });
//       // const updatedProduct =  product.reviews.populate("reviews",["reviews.name","reviews.image","reviews.rating","reviews.comment","reviews.images","reviews.title"]);
//       await review.save().then((d) => {
//         return Product.findByIdAndUpdate({ _id: productId }, { $push: { reviews: d } }, {
//           new: true,
//           // runValidators: true,
//         }, function (error, success) {
//           if (error) {
//             console.log(error)
//           } else {
//             console.log(success)
//           }
//         })
//       }).then((product) => {
//         // product?.reviews?.unshift(review)

//         return product?.save()
//       })


//       // console.log("up",product)
//       product.numReviews = product.reviews.length;

//       product.rating =
//         product.reviews.reduce((a, c) => c.rating + a, 0) /
//         product.reviews.length;

//       // await product.save(updatedProduct);
//       // console.log(updatedProduct)

//       res.status(201).json({
//         message: "Review Created",
//         review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
//         numReviews: product.numReviews,
//         rating: product.rating,
//         images: product.images,
//         title: product.title,
//         image: product.image,
//       });
//     } else {
//       res.status(404).json({ message: "Product Not Found" });
//     }
//   } catch (error) { }
// };

const express = require("express");
const app = express();
const connectDB = require("./db/connectToDb");
require("dotenv").config();
const userRoute = require("./routes/User");
const cartRoute = require("./routes/Cart");
const productRoute = require("./routes/Product");
const vendorRoute = require("./routes/Vendor");
const orderRoute = require("./routes/Order");
const cors = require("cors");

const PORT = 5555 || process.env.PORT;
app.use(cors());
app.use(express.json()); /*** this allows me to send back Json reponse */

connectDB();
app.use("/api/v1/user", userRoute);
// app.use("/api/v1/product", cartRoute);
app.use("/api/v1/product", productRoute);
// app.use("/api/v1/vendor", vendorRoute);
app.use("/api/v1/order", orderRoute);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

// const data = await User.aggregate([
//   { $match: { createdAt: { $gte: lastYear } } },
//   {
//     $project:{month:{$month:"$createdAt"},}
//   }, {
//     $group: {
//       _id: "$month",
//       total:{$sum:1}
//     }
//   }
// ])

// const obj = { color: "red", category: "jean" };

// console.log(Object.entries(obj));

// // linked List something
// const list = [3,5,3,2,5,5,3,2,6];

// const midLinkList = (list) => {
//   let newList = [];
//   const listLen = list.length;

//   let midElement = listLen / 2;
//   console.log(midElement)

//   if (Number.isInteger(midElement)) {
//     for (let i = midElement - 1; i < listLen; i++) {
//       newList.push(list[i]);
//     }
//   } else {
//     for (let i = midElement - 0.5; i < listLen; i++) {
//       newList.push(list[i]);
//     }
//   }

//   console.log(midElement);

//   return newList;
// };

// const answer = midLinkList(list);
// console.log(answer)




// const Str1 = "coast";
// const Str2 = "costa rica";

// const check = (Str1, str2) => {
//   let state = false;
//   let truthArray = [];
//   let keepTrack = []
//   const lenStr1 = Str1.length;

//   const trueCondition = () => {

    
//     for (let i = 0; i < Str1.length; i++) { truthArray.push(false) }
    
//     if ((truthArray.length = lenStr1) && (truthArray.every(function (a) {
//       if(a === true)
//       return true
//     })))
    
//     {
//       state = true;
//     }
//   };


//   let curr = "";

//   for (let i = 0; i < Str2.length; i++) {
//     curr = Str2[i];
//     for (let j = 0; j < Str1.length; j++) {
//       if (curr === Str1[j] && !keepTrack.includes(Str1[j]) ) {
//         keepTrack.push(curr)
//         truthArray.push(true);
//         continue;
//       } else {
        
//         continue;
//       }
//     }
//   }

//   trueCondition();

//   console.log(
//     `the state is ${state}`,
//     truthArray
//   );

//   return state;
// };

// check(Str1,Str2);

// // middleware/apiTracker.js
// const User = require("../models/user");

// const trackApiCalls = async (req, res, next) => {
//   if (req.user) {
//     try {
//       const user = await User.findById(req.user._id);
//       user.apiCalls += 1;
//       await user.save();
//     } catch (err) {
//       console.error("Error tracking API call:", err);
//     }
//   }
//   next();
// };

// module.exports = { trackApiCalls };

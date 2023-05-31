const express =  require("express");
const { registerUser, loginUser, getUser, updateUser, getUserProfile  } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/profile")
    .get(protect, getUser)
    .put(protect, updateUser);
router.get("/:id", getUserProfile);

module.exports = router;

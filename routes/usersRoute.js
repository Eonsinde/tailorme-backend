const express =  require("express");
const { registerUser, loginUser, getUser, updateUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.route("/me")
    .get(protect, getUser)
    .put(protect, updateUser);

module.exports = router;

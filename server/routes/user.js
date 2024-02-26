const express = require("express");
const uploadOptions = require("../multer");
const {
  createUser,
  userActivation,
  userLogin,
  getUser,
  userLogout,
  userUpdate,
  updateUserAvatar,
  updateUserAddress,
  deleteUserAddress,
  updateUserPassword,
  getAllUsers,
  deleteUser,
} = require("../controllers/user");
const { authenticateUser } = require("../middlewares/authentication");
const router = express.Router();

router.post("/create", uploadOptions.single("file"), createUser);
router.post("/login", userLogin);
router.post("/activation", userActivation);
router.get("/get/:id", getUser);
router.get("/getAll", getAllUsers);
router.get("/logout", userLogout);
router.patch("/update", userUpdate);
router.patch("/update-user-address", updateUserAddress);
router.patch("/update/avatar", uploadOptions.single("file"), updateUserAvatar);
router.post("/delete-address/:id", deleteUserAddress);
router.patch("/update-password", updateUserPassword);
router.delete("/delete/:id", deleteUser);

module.exports = router;

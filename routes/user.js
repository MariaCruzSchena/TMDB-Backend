const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { validateAuth } = require("../middlewares/auth");

//User routes
router.get("/", userController.getAllUsers);
router.post("/login", userController.loginUser);
router.post("/signup", userController.signUpUser);
router.post("/logout",  userController.logoutUser);

//User favorites routes
router.get("/:userId/favorites", userController.getAllFavorites);
router.post("/:userId/favorites", userController.addToFavorites);
router.delete(
  "/:userId/favorites", 
  userController.deleteFromFavorites
);

module.exports = router;

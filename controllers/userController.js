const axios = require("axios");
const { User, Favorites } = require("../models/index");
const { generateToken, validateToken } = require("../config/token");
const { validateAuth } = require("../middlewares/auth");

//USERS CONTROLLERS
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  User.findByEmail(email)
    .then((user) => {
      user.validatePassword(password).then((validation) => {
        if (!validation)
          return res
            .status(401)
            .send(
              "Incorrect password. Please try again or reset your password."
            );

        const payload = {
          email: user.email,
          name: user.fullName,
          password: user.password,
        };
        const token = generateToken(payload);
        res.cookie("token", token);
        res.status(200).send(user);
      });
    })
    .catch(() =>
      res.status(404).send({
        message:
          "We can't find an account with this email address. Please try again or create a new account.",
      })
    );
};

const signUpUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(fullName, email, password);
    const existsInDB = await User.findOne({ where: { email } });
    console.log(existsInDB);

    if (existsInDB) {
      res.status(400).send({ message: "User already exists" });
      return;
    }

    const newUser = await User.create({
      fullName: fullName,
      email: email,
      password: password,
    });

    res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send({ message: "All fields must be provided" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    console.log("ALL USERS", users);
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send({ message: "Couldn't find users" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.sendStatus(204);
};
//FAVORITES CONTROLLERS

const addToFavorites = (req, res) => {
  const { userId } = req.params;
  const { id } = req.body.item;
  const { type } = req.query;

  User.findByPk(userId).then((user) => {
    Favorites.create({ mediaId: id, type })
      .then((newFavorite) => {
        newFavorite.setUser(user);
        res.status(201).send(newFavorite);
      })
      .catch(() => res.status(409).send("Error creating favorite"));
  });
};

const deleteFromFavorites = async (req, res) => {
  try {
    const { mediaId } = req.query;

    const deleted = await Favorites.destroy({ where: { mediaId } });
    !deleted
      ? res.status(404).send("Favorite not found")
      : res.status(202).send("Media deleted");
  } catch {
    res.status(500).send("Could not delete from favorites");
  }
};

const getAllFavorites = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const favorites = await Favorites.findAll({ where: { userId } });
    const favoritesWithTypes = favorites.map((fav) => fav.type);
    const favoritesPromises = favorites.map((fav) =>
      axios.get(
        `https://api.themoviedb.org/3/${fav.type}/${fav.mediaId}?api_key=66cd97e922cf9113528fada4166f6e6a&language=en-US`
      )
    );
    const favoritesFullfilled = await Promise.all(favoritesPromises);
    console.log(favoritesFullfilled)
    const favoritesDetailed = favoritesFullfilled.flatMap(
      (response, index) => ({
        ...response.data,
        media_type: favoritesWithTypes[index],
      })
    );

    res.status(200).send(favoritesDetailed);
  } catch {
    res.status(404).send("Could not get favorites");
  }
};

module.exports = {
  loginUser,
  signUpUser,
  logoutUser,
  getAllUsers,
  addToFavorites,
  deleteFromFavorites,
  getAllFavorites,
};

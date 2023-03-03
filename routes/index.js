const express = require("express");
const router = express.Router();
const userRouter = require("./user");
const multimediaRouter = require("./multimedia");

router.use("/user", userRouter);
router.use("/search", multimediaRouter);

module.exports = router;

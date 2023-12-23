const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("HELLO qoala server!");
});

module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const detectTextfromOCR = require("../services/detectTextFromOCR");
const Document = mongoose.model("Document");

router.get("/mydocs", requireLogin, (req, res) => {
  Document.find({ created_by: req.user._id })
    .populate("created_by", "_id name")
    .then((docs) => {
      res.json({ docs });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/createdoc", requireLogin, async (req, res) => {
  console.log(req.body);
  const { image_link } = req.body;
  if (!image_link) {
    return res
      .status(422)
      .json({ error: "Document image_link cannot be empty!" });
  }

  req.user.password = undefined;

  try {
    const extractedInfo = await detectTextfromOCR(image_link);
    // Use the extracted information as needed
    console.log("ocr data: ", extractedInfo);

    const document = new Document({
      identification_number: extractedInfo.idNumber,
      name: extractedInfo.name,
      last_name: extractedInfo.lastName,
      date_of_birth: extractedInfo.dob,
      date_of_issue: extractedInfo.issueDate,
      date_of_expiry: extractedInfo.expiryDate,
      raw_ocr_data: extractedInfo.rawData,
      image_link: image_link,
      success_level: extractedInfo.percentageSuccess,
      created_by: req.user,
    });

    document
      .save()
      .then((result) => {
        res.json({ document: result });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    console.error("Error processing image:", error);
  }
});

module.exports = router;

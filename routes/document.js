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

router.get("/mydocs/:docid", requireLogin, (req, res) => {
  console.log("/mydoc: ", req.body);
  Document.findById(req.params.docid)
    .then((result) => {
      console.log("/mydoc result: ", result);
      res.status(200).json({ mydoc_data: result });
    })
    .catch((err) => {
      console.error("/mydocs fetch api error: ", err);
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

router.put("/editdoc/:docid", requireLogin, (req, res) => {
  console.log("editdoc: " + req.body);
  const {
    identification_number,
    name,
    last_name,
    date_of_birth,
    date_of_issue,
    date_of_expiry,
    success_level,
    raw_ocr_data,
    image_link,
  } = req.body;

  Document.findByIdAndUpdate(
    req.params.docid,
    {
      identification_number: identification_number,
      name: name,
      last_name: last_name,
      date_of_birth: date_of_birth,
      date_of_issue: date_of_issue,
      date_of_expiry: date_of_expiry,
      success_level: success_level,
      raw_ocr_data: raw_ocr_data,
      image_link: image_link,
    },
    {
      new: true,
    }
  )
    .then((result) => {
      res.status(200).json({ editdoc_data: result });
    })
    .catch((err) => {
      res.status(422).json({ editdoc_data: err });
    });
});

router.delete("/deletedoc/:docid", requireLogin, (req, res) => {
  console.log("/deletedoc: ", req.body);

  Document.findByIdAndDelete(req.params.docid)
    .then((doc) => {
      if (!doc) {
        res.status(404).json({ deletedoc_data: "Document not found" });
      }
      res.status(200).json({ deletedoc_data: doc });
    })
    .catch((err) => {
      console.error("deletedoc api error: " + err);
    });
});

module.exports = router;

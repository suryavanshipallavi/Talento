const express = require('express');
const router = express.Router();
const companyModel = require('../model/companyModel');
const multer = require('multer');
const path = require('path');

// Configure multer for file upload (store files in the 'uploads/logo' folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store files in the 'uploads/logo' folder
    cb(null, 'uploads/logo/');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename based on the timestamp and original file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Add company (with image upload)
router.post('/add', upload.single('logo'), (req, res) => {
  console.log(req.body);
  const { compName, compEmail, password, about, firstName, lastName, country, streetAddress, city, region, postalCode } = req.body;

  // If there's a logo, we set the path to the uploaded file
  let logoPath = 'logo_placeholder.png'; // Default if no logo is uploaded
  if (req.file) {
    logoPath = `logo/${req.file.filename}`; // Store the relative path to the 'logo' folder
  }

  const newCompany = new companyModel({
    compName,
    compEmail,
    password,
    about,
    firstName,
    lastName,
    country,
    streetAddress,
    city,
    region,
    postalCode,
    logo: logoPath, // Store the logo filename with 'logo' folder path
  });

  newCompany.save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Authenticate company login
router.post('/authenticate', (req, res) => {
  console.log(req.body);
  companyModel.findOne(req.body)
    .then((result) => {
      if (result) res.status(200).json(result);
      else res.status(400).json({ message: 'Login Failed' });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get all companies
router.get('/getall', (req, res) => {
  companyModel.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Update company information (with image upload)
router.put('/update/:id', upload.single('logo'), (req, res) => {
  const { compName, compEmail, password, about, firstName, lastName, country, streetAddress, city, region, postalCode } = req.body;

  // If there's a new logo, we update the logo path, otherwise, keep the current one
  let logoPath = req.body.logo || 'logo_placeholder.png'; // Default to current logo if no new logo uploaded
  if (req.file) {
    logoPath = `logo/${req.file.filename}`; // Store the new logo filename in the 'logo' folder
  }

  companyModel.findByIdAndUpdate(req.params.id, {
    compName,
    compEmail,
    password,
    about,
    firstName,
    lastName,
    country,
    streetAddress,
    city,
    region,
    postalCode,
    logo: logoPath,
  }, { new: true })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Get company by ID
router.get('/getbyid/:id', (req, res) => {
  companyModel.findById(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

module.exports = router;

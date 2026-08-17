const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const applyModel = require('../model/applyModel'); // Changed to applyModel

// Multer configuration for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure the directory exists
    cb(null, 'uploads/resumes');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and DOC/DOCX are allowed.'), false);
  }
};

const upload = multer({ storage, fileFilter });

/* ========== ROUTES ========== */

// POST /apply/add – Add a new application
router.post('/add', upload.single('resume'), async (req, res) => {
  try {
    const { interview, user } = req.body;
    const resumePath = req.file ? req.file.path : null;

    const newApplication = new applyModel({
      interview,
      user,
      resume: resumePath // Save the resume path to the database
    });

    const savedApplication = await newApplication.save();
    res.status(200).json(savedApplication);
  } catch (err) {
    console.error('Error adding application:', err);
    res.status(500).json({ error: 'Internal Server Error while saving application' });
  }
});

// GET /apply/getall – Get all applications
router.get('/getall', async (req, res) => {
  try {
    const applications = await applyModel.find();
    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching all applications:', err);
    res.status(500).json({ error: 'Internal Server Error while fetching applications' });
  }
});

// GET /apply/getbyid/:id – Get application by ID
router.get('/getbyid/:id', async (req, res) => {
  try {
    const application = await applyModel.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json(application);
  } catch (err) {
    console.error('Error fetching application by ID:', err);
    res.status(500).json({ error: 'Internal Server Error while fetching application' });
  }
});

// GET /apply/checkapplication/:id/:userid – Check if user has already applied
router.get('/checkapplication/:id/:userid', async (req, res) => {
  try {
    const { id, userid } = req.params;

    const application = await applyModel.findOne({
      interview: id,
      user: userid
    });

    res.status(200).json(application);
  } catch (err) {
    console.error('Error checking application:', err);
    res.status(500).json({ error: 'Internal Server Error while checking application' });
  }
});

// PUT /apply/update/:id – Update application and resume if uploaded
router.put('/update/:id', upload.single('resume'), async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) {
      updateData.resume = req.file.path; // Save new resume path if updated
    }

    const updatedApplication = await applyModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: 'Application not found to update' });
    }

    res.status(200).json(updatedApplication);
  } catch (err) {
    console.error('Error updating application:', err);
    res.status(500).json({ error: 'Internal Server Error while updating application' });
  }
});

// GET /apply/getbyuser/:userId – Get all applications by User ID
router.get('/getbyuser/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const applications = await applyModel.find({ user: userId })
      .populate({
        path: 'interview',
        populate: { path: 'company', model: 'companyData' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications by user ID:', err);
    res.status(500).json({ error: 'Internal Server Error while fetching user applications' });
  }
});

// ✅ GET /apply/getbyinterview/:interviewId – Get all applications by Interview (Company) ID
router.get('/getbyinterview/:interviewId', async (req, res) => {
  try {
    const { interviewId } = req.params;

    // Find applications related to a specific interview/job post (company)
    const applications = await applyModel.find({ interview: interviewId })
      .populate('user') // Optional: This will populate the user data (applicant info) if needed
      .sort({ createdAt: -1 }); // Optional: Sort by creation date, latest first

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications by interview/job post ID:', err);
    res.status(500).json({ error: 'Internal Server Error while fetching interview/job post applications' });
  }
});

module.exports = router;

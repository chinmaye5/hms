const express = require('express');
const hospitalController = require('../controllers/hospitalController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route
router.get('/', hospitalController.getHospitalsByCity);

// Protected routes - Admin only
router.post('/create', protect, authorize('admin'), hospitalController.createHospital);
router.delete('/delete', protect, authorize('admin'), hospitalController.deleteHospital);
router.put('/update', protect, authorize('admin'), hospitalController.updateHospital);
router.post('/details', protect, authorize('admin'), hospitalController.addHospitalDetails);

module.exports = router;
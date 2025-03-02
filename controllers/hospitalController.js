const hospitalService = require('../services/hospitalService');

exports.createHospital = async (req, res) => {
  try {
    const { name, city, image, specialty, rating } = req.body;
    
    // Validate required fields
    if (!name || !city || !image || !specialty || rating === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }
    
    const hospital = await hospitalService.createHospital(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'Hospital created successfully',
      data: hospital
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getHospitalsByCity = async (req, res) => {
  try {
    const { city } = req.query;
    const hospitals = await hospitalService.getHospitalsByCity(city);
    
    return res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteHospital = async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Hospital ID is required'
      });
    }
    
    await hospitalService.deleteHospital(id);
    
    return res.status(200).json({
      success: true,
      message: 'Hospital deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateHospital = async (req, res) => {
  try {
    const { id } = req.query;
    const { rating, image } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Hospital ID is required'
      });
    }
    
    // Check if at least one update field is provided
    if (rating === undefined && image === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one field (rating or image) must be provided for update'
      });
    }
    
    const hospital = await hospitalService.updateHospital(id, req.body);
    
    return res.status(200).json({
      success: true,
      message: 'Hospital updated successfully',
      data: hospital
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addHospitalDetails = async (req, res) => {
  try {
    const { id } = req.query;
    const { description, images, numberOfDoctors, numberOfDepartments } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Hospital ID is required'
      });
    }
    
    // Check if at least one detail field is provided
    if (!description && !images && numberOfDoctors === undefined && numberOfDepartments === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one detail field must be provided'
      });
    }
    
    const hospital = await hospitalService.addHospitalDetails(id, req.body);
    
    return res.status(200).json({
      success: true,
      message: 'Hospital details added successfully',
      data: hospital
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
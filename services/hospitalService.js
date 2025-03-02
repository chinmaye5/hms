const Hospital = require('../models/Hospital');

exports.createHospital = async (hospitalData) => {
  try {
    const hospital = new Hospital(hospitalData);
    return await hospital.save();
  } catch (error) {
    throw error;
  }
};

exports.getHospitalsByCity = async (city) => {
  try {
    const query = city ? { city: { $regex: city, $options: 'i' } } : {};
    return await Hospital.find(query);
  } catch (error) {
    throw error;
  }
};

exports.deleteHospital = async (id) => {
  try {
    const result = await Hospital.findByIdAndDelete(id);
    if (!result) {
      throw new Error('Hospital not found');
    }
    return result;
  } catch (error) {
    throw error;
  }
};

exports.updateHospital = async (id, updateData) => {
  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      throw new Error('Hospital not found');
    }
    
    // Update only specified fields
    if (updateData.rating !== undefined) {
      hospital.rating = updateData.rating;
    }
    if (updateData.image !== undefined) {
      hospital.image = updateData.image;
    }
    
    hospital.updatedAt = Date.now();
    return await hospital.save();
  } catch (error) {
    throw error;
  }
};

exports.addHospitalDetails = async (id, detailsData) => {
  try {
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      throw new Error('Hospital not found');
    }
    
    // Initialize details object if it doesn't exist
    if (!hospital.details) {
      hospital.details = {};
    }
    
    // Update details fields
    if (detailsData.description !== undefined) {
      hospital.details.description = detailsData.description;
    }
    if (detailsData.images !== undefined) {
      hospital.details.images = detailsData.images;
    }
    if (detailsData.numberOfDoctors !== undefined) {
      hospital.details.numberOfDoctors = detailsData.numberOfDoctors;
    }
    if (detailsData.numberOfDepartments !== undefined) {
      hospital.details.numberOfDepartments = detailsData.numberOfDepartments;
    }
    
    hospital.updatedAt = Date.now();
    return await hospital.save();
  } catch (error) {
    throw error;
  }
};
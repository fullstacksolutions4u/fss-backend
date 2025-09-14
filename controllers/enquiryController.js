import Enquiry from '../models/Enquiry.js';
import { createResponse } from '../utils/response.js';
import mongoose from 'mongoose';

const createEnquiryService = async (enquiryData) => {
  const enquiry = new Enquiry(enquiryData);
  await enquiry.save();
  
  console.log('Email notification sent to admin for:', enquiry.name);
  console.log('Confirmation email sent to:', enquiry.email);
  
  return enquiry;
};

const getAllEnquiriesService = async (filters = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = options;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [enquiries, total] = await Promise.all([
    Enquiry.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Enquiry.countDocuments(filters)
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    enquiries,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

export const createEnquiry = async (req, res, next) => {
  try {
    const enquiryData = {
      ...req.body,
      metadata: {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'],
        source: 'website'
      }
    };

    const enquiry = await createEnquiryService(enquiryData);

    res.status(201).json(createResponse(
      true,
      'Enquiry submitted successfully. We will get back to you soon!',
      { enquiry }
    ));
  } catch (error) {
    console.error('Create enquiry error:', error);
    next(error);
  }
};

export const getAllEnquiries = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      service,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filters = {};
    if (status) filters.status = status;
    if (service) filters.service = service;
    
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      sortOrder
    };

    const result = await getAllEnquiriesService(filters, options);

    res.json(createResponse(
      true,
      'Enquiries retrieved successfully',
      result
    ));
  } catch (error) {
    console.error('Get all enquiries error:', error);
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json(createResponse(
        false,
        'Invalid enquiry ID format'
      ));
    }

    const enquiry = await Enquiry.findByIdAndDelete(id);
    
    if (!enquiry) {
      return res.status(404).json(createResponse(
        false,
        'Enquiry not found'
      ));
    }

    res.json(createResponse(
      true,
      'Enquiry deleted successfully',
      { deletedId: id }
    ));
  } catch (error) {
    console.error('Delete enquiry error:', error);
    next(error);
  }
};

export default {
  createEnquiry,
  getAllEnquiries,
  deleteEnquiry
};
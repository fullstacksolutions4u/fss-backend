import * as enquiryService from '../services/enquiryService.js';

const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    const enquiryData = { name, email, phone, service, message };
    const metadata = {
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      source: 'Website'
    };

    const enquiry = await enquiryService.createEnquiry(enquiryData, metadata);

    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: {
        id: enquiry._id,
        name: enquiry.name,
        email: enquiry.email,
        service: enquiry.service,
        createdAt: enquiry.createdAt
      }
    });

  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry'
    });
  }
};

const getAllEnquiries = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.service) filter.service = req.query.service;

    const pagination = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await enquiryService.getAllEnquiries(filter, pagination);

    res.status(200).json({
      success: true,
      data: result.enquiries,
      pagination: result.pagination
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries'
    });
  }
};

const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await enquiryService.getEnquiryById(req.params.id);
    
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiry'
    });
  }
};

const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const enquiry = await enquiryService.updateEnquiryStatus(req.params.id, status);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update status'
    });
  }
};

const addNote = async (req, res) => {
  try {
    const { content } = req.body;
    
    const enquiry = await enquiryService.addNoteToEnquiry(req.params.id, content);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add note'
    });
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await enquiryService.getEnquiryStats();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

export {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addNote,
  getStats
};
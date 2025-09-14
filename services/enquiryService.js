import Enquiry from '../models/Enquiry.js';
import mongoose from 'mongoose';

export const enquiryService = {
  createEnquiry: async (enquiryData) => {
    try {
      const enquiry = new Enquiry(enquiryData);
      await enquiry.save();
      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  getAllEnquiries: async (filters = {}, options = {}) => {
    try {
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
    } catch (error) {
      throw error;
    }
  },

  deleteEnquiry: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      const enquiry = await Enquiry.findByIdAndDelete(id);
      
      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  }
};
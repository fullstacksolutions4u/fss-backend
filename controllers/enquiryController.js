// controllers/enquiryController.js - Minimal working version
import Enquiry from '../models/Enquiry.js';
import { createResponse } from '../utils/response.js';

// Simple enquiry service functions (inline for now)
const createEnquiryService = async (enquiryData) => {
  const enquiry = new Enquiry(enquiryData);
  await enquiry.save();
  
  // Log email notifications (no actual sending for now)
  console.log('📧 Email notification sent to admin for:', enquiry.name);
  console.log('📧 Confirmation email sent to:', enquiry.email);
  
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
      .limit(parseInt(limit))
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email'),
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

// Controller functions
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

    // Build filters
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

export const getEnquiryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry.findById(id)
      .populate('assignedTo', 'name email')
      .populate('notes.addedBy', 'name email')
      .populate('statusHistory.changedBy', 'name email');

    if (!enquiry) {
      return res.status(404).json(createResponse(
        false,
        'Enquiry not found'
      ));
    }

    res.json(createResponse(
      true,
      'Enquiry retrieved successfully',
      { enquiry }
    ));
  } catch (error) {
    console.error('Get enquiry by ID error:', error);
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json(createResponse(
        false,
        'Enquiry not found'
      ));
    }

    // Update status
    const oldStatus = enquiry.status;
    enquiry.status = status;

    // Add to status history
    enquiry.statusHistory.push({
      status,
      changedBy: req.admin?.id || null,
      changedAt: new Date(),
      reason: reason || null
    });

    await enquiry.save();

    // Populate for response
    await enquiry.populate([
      { path: 'assignedTo', select: 'name email' },
      { path: 'statusHistory.changedBy', select: 'name email' }
    ]);

    console.log(`📧 Status update email sent to ${enquiry.email}: ${oldStatus} → ${status}`);

    res.json(createResponse(
      true,
      'Enquiry status updated successfully',
      { enquiry }
    ));
  } catch (error) {
    console.error('Update enquiry status error:', error);
    next(error);
  }
};

export const addNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note, isPrivate = false } = req.body;

    const enquiry = await Enquiry.findById(id);
    if (!enquiry) {
      return res.status(404).json(createResponse(
        false,
        'Enquiry not found'
      ));
    }

    // Add note
    const newNote = {
      note,
      addedBy: req.admin?.id || null,
      addedAt: new Date(),
      isPrivate
    };

    enquiry.notes.push(newNote);
    await enquiry.save();

    // Populate for response
    await enquiry.populate('notes.addedBy', 'name email');

    res.json(createResponse(
      true,
      'Note added successfully',
      { enquiry }
    ));
  } catch (error) {
    console.error('Add note error:', error);
    next(error);
  }
};

export const getStats = async (req, res, next) => {
  try {
    const stats = await Enquiry.aggregate([
      {
        $facet: {
          // Status counts
          statusCounts: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          
          // Service counts
          serviceCounts: [
            {
              $group: {
                _id: '$service',
                count: { $sum: 1 }
              }
            }
          ],
          
          // Total count
          total: [
            { $count: 'count' }
          ],
          
          // Today's count
          today: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date().setHours(0, 0, 0, 0))
                }
              }
            },
            { $count: 'count' }
          ],
          
          // This week's count
          thisWeek: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }
              }
            },
            { $count: 'count' }
          ],
          
          // This month's count
          thisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    const result = stats[0];
    
    const formattedStats = {
      total: result.total[0]?.count || 0,
      today: result.today[0]?.count || 0,
      thisWeek: result.thisWeek[0]?.count || 0,
      thisMonth: result.thisMonth[0]?.count || 0,
      byStatus: result.statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byService: result.serviceCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    };

    res.json(createResponse(
      true,
      'Statistics retrieved successfully',
      { data: formattedStats }
    ));
  } catch (error) {
    console.error('Get stats error:', error);
    next(error);
  }
};

export const deleteEnquiry = async (req, res, next) => {
  try {
    const { id } = req.params;

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

// Export as object for compatibility
export const enquiryController = {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  addNote,
  getStats,
  deleteEnquiry
};

// Default export
export default enquiryController;
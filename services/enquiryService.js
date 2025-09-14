// services/enquiryService.js - Complete enquiry service
import Enquiry from '../models/Enquiry.js';
import { emailService } from './emailService.js';
import mongoose from 'mongoose';

export const enquiryService = {
  // Create new enquiry
  createEnquiry: async (enquiryData) => {
    try {
      const enquiry = new Enquiry(enquiryData);
      await enquiry.save();

      // Send notification emails (non-blocking)
      try {
        await emailService.sendNewEnquiryNotification(enquiry);
        await emailService.sendCustomerConfirmation(enquiry);
      } catch (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw error for email failures
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Get all enquiries with filtering and pagination
  getAllEnquiries: async (filters = {}, options = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        populate = []
      } = options;

      const skip = (page - 1) * limit;
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Build query
      let query = Enquiry.find(filters);

      // Add population if specified
      if (populate && populate.length > 0) {
        populate.forEach(pop => {
          query = query.populate(pop);
        });
      }

      // Execute query with pagination
      const [enquiries, total] = await Promise.all([
        query
          .sort(sort)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        Enquiry.countDocuments(filters)
      ]);

      const totalPages = Math.ceil(total / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      return {
        enquiries,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages,
          hasNext,
          hasPrev
        }
      };
    } catch (error) {
      throw error;
    }
  },

  // Get enquiry by ID
  getEnquiryById: async (id) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      const enquiry = await Enquiry.findById(id)
        .populate('assignedTo', 'name email')
        .populate('notes.addedBy', 'name email')
        .populate('statusHistory.changedBy', 'name email');

      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Update enquiry status with history tracking
  updateEnquiryStatus: async (id, status, changedBy, reason = null) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      const enquiry = await Enquiry.findById(id);
      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      // Set the changedBy for the pre-save middleware
      enquiry._statusChangedBy = changedBy;
      enquiry.status = status;

      // If reason provided, add it to the latest status history entry
      if (reason) {
        // The pre-save middleware will add the status history entry
        // We need to add the reason after save
        await enquiry.save();
        
        // Update the latest status history entry with reason
        const latestHistoryIndex = enquiry.statusHistory.length - 1;
        enquiry.statusHistory[latestHistoryIndex].reason = reason;
        await enquiry.save();
      } else {
        await enquiry.save();
      }

      // Populate and return
      await enquiry.populate([
        { path: 'assignedTo', select: 'name email' },
        { path: 'statusHistory.changedBy', select: 'name email' }
      ]);

      // Send status update email (non-blocking)
      try {
        await emailService.sendStatusUpdateNotification(enquiry, status);
      } catch (emailError) {
        console.error('Status update email error:', emailError);
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Assign enquiry to admin
  assignEnquiry: async (id, assignedTo) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
        throw new Error('Invalid admin ID');
      }

      const enquiry = await Enquiry.findByIdAndUpdate(
        id,
        { assignedTo: assignedTo || null },
        { new: true, runValidators: true }
      ).populate('assignedTo', 'name email');

      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Update enquiry priority
  updatePriority: async (id, priority) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      const enquiry = await Enquiry.findByIdAndUpdate(
        id,
        { priority },
        { new: true, runValidators: true }
      );

      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Add tags to enquiry
  addTags: async (id, tags) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      const enquiry = await Enquiry.findByIdAndUpdate(
        id,
        { $addToSet: { tags: { $each: tags } } },
        { new: true, runValidators: true }
      );

      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Set follow-up date
  setFollowUpDate: async (id, followUpDate) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      const enquiry = await Enquiry.findByIdAndUpdate(
        id,
        { followUpDate },
        { new: true, runValidators: true }
      );

      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Add note to enquiry
  addNote: async (id, noteText, addedBy, isPrivate = false) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid enquiry ID');
      }

      if (!mongoose.Types.ObjectId.isValid(addedBy)) {
        throw new Error('Invalid admin ID');
      }

      const note = {
        note: noteText,
        addedBy,
        isPrivate,
        addedAt: new Date()
      };

      const enquiry = await Enquiry.findByIdAndUpdate(
        id,
        { $push: { notes: note } },
        { new: true, runValidators: true }
      ).populate('notes.addedBy', 'name email');

      if (!enquiry) {
        throw new Error('Enquiry not found');
      }

      return enquiry;
    } catch (error) {
      throw error;
    }
  },

  // Delete enquiry
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
  },

  // Get statistics
  getStats: async () => {
    try {
      const stats = await Enquiry.aggregate([
        {
          $facet: {
            // Total counts
            statusCounts: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 }
                }
              }
            ],
            
            // Service breakdown
            serviceCounts: [
              {
                $group: {
                  _id: '$service',
                  count: { $sum: 1 }
                }
              }
            ],
            
            // Priority breakdown
            priorityCounts: [
              {
                $group: {
                  _id: '$priority',
                  count: { $sum: 1 }
                }
              }
            ],
            
            // Total count
            total: [
              { $count: 'count' }
            ],
            
            // Today's enquiries
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
            
            // This week's enquiries
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
            
            // This month's enquiries
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
      
      // Format the response
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
        }, {}),
        byPriority: result.priorityCounts.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      };

      return { data: formattedStats };
    } catch (error) {
      throw error;
    }
  },

  // Get enquiries due for follow-up
  getFollowUpEnquiries: async () => {
    try {
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const enquiries = await Enquiry.find({
        followUpDate: { $lte: today },
        status: { $in: ['New', 'In Progress'] }
      })
        .populate('assignedTo', 'name email')
        .sort({ followUpDate: 1 });

      return enquiries;
    } catch (error) {
      throw error;
    }
  },

  // Get enquiry activity feed
  getActivityFeed: async (limit = 20) => {
    try {
      const enquiries = await Enquiry.find()
        .select('name email service status createdAt updatedAt statusHistory notes')
        .populate('statusHistory.changedBy', 'name')
        .populate('notes.addedBy', 'name')
        .sort({ updatedAt: -1 })
        .limit(limit);

      const activities = [];

      enquiries.forEach(enquiry => {
        // Add status changes
        enquiry.statusHistory.forEach(history => {
          activities.push({
            type: 'status_change',
            enquiryId: enquiry._id,
            enquiryName: enquiry.name,
            timestamp: history.changedAt,
            actor: history.changedBy?.name || 'System',
            data: {
              newStatus: history.status,
              reason: history.reason
            }
          });
        });

        // Add notes
        enquiry.notes.forEach(note => {
          if (!note.isPrivate) { // Only include public notes in feed
            activities.push({
              type: 'note_added',
              enquiryId: enquiry._id,
              enquiryName: enquiry.name,
              timestamp: note.addedAt,
              actor: note.addedBy?.name || 'Admin',
              data: {
                note: note.note.substring(0, 100) + (note.note.length > 100 ? '...' : '')
              }
            });
          }
        });

        // Add creation
        activities.push({
          type: 'enquiry_created',
          enquiryId: enquiry._id,
          enquiryName: enquiry.name,
          timestamp: enquiry.createdAt,
          actor: 'Customer',
          data: {
            service: enquiry.service,
            email: enquiry.email
          }
        });
      });

      // Sort by timestamp and return limited results
      return activities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
    } catch (error) {
      throw error;
    }
  }
};
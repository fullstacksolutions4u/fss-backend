import Enquiry from '../models/Enquiry.js';
import { createResponse } from '../utils/response.js';

export const dashboardController = {
  // Get dashboard overview
  getOverview: async (req, res, next) => {
    try {
      // Get basic stats
      const stats = await Enquiry.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            statusBreakdown: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 }
                }
              }
            ],
            serviceBreakdown: [
              {
                $group: {
                  _id: '$service',
                  count: { $sum: 1 }
                }
              }
            ],
            today: [
              {
                $match: {
                  createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
                }
              },
              { $count: 'count' }
            ]
          }
        }
      ]);

      // Get recent enquiries
      const recentEnquiries = await Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email service status createdAt subject');

      const result = stats[0];
      const overview = {
        stats: {
          total: result.total[0]?.count || 0,
          today: result.today[0]?.count || 0,
          byStatus: result.statusBreakdown.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {}),
          byService: result.serviceBreakdown.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {})
        },
        recentEnquiries,
        charts: {
          statusBreakdown: result.statusBreakdown,
          serviceBreakdown: result.serviceBreakdown
        }
      };

      res.json(createResponse(
        true,
        'Dashboard overview retrieved successfully',
        overview
      ));
    } catch (error) {
      console.error('Dashboard overview error:', error);
      next(error);
    }
  },

  // Get analytics
  getAnalytics: async (req, res, next) => {
    try {
      const { period = '30d' } = req.query;
      
      let startDate = new Date();
      switch (period) {
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '3m':
          startDate.setMonth(startDate.getMonth() - 3);
          break;
        case '6m':
          startDate.setMonth(startDate.getMonth() - 6);
          break;
        case '1y':
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate.setDate(startDate.getDate() - 30);
      }

      const analytics = await Enquiry.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $facet: {
            totalCount: [{ $count: 'count' }],
            serviceDistribution: [
              {
                $group: {
                  _id: '$service',
                  count: { $sum: 1 }
                }
              }
            ],
            statusDistribution: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 }
                }
              }
            ],
            dailyTrend: [
              {
                $group: {
                  _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    day: { $dayOfMonth: '$createdAt' }
                  },
                  count: { $sum: 1 }
                }
              },
              { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
            ]
          }
        }
      ]);

      res.json(createResponse(
        true,
        'Analytics retrieved successfully',
        {
          period,
          analytics: analytics[0]
        }
      ));
    } catch (error) {
      console.error('Analytics error:', error);
      next(error);
    }
  },

  // Get performance metrics
  getPerformanceMetrics: async (req, res, next) => {
    try {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const [currentMonth, previousMonth] = await Promise.all([
        Enquiry.aggregate([
          {
            $match: { createdAt: { $gte: thisMonth } }
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
                }
              }
            }
          }
        ]),
        Enquiry.aggregate([
          {
            $match: {
              createdAt: { $gte: lastMonth, $lt: thisMonth }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              completed: {
                $sum: {
                  $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
                }
              }
            }
          }
        ])
      ]);

      const current = currentMonth[0] || { total: 0, completed: 0 };
      const previous = previousMonth[0] || { total: 0, completed: 0 };

      const calculateGrowth = (current, previous) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return Math.round(((current - previous) / previous) * 100);
      };

      const metrics = {
        currentMonth: current,
        growth: {
          total: calculateGrowth(current.total, previous.total),
          completed: calculateGrowth(current.completed, previous.completed)
        },
        comparison: {
          lastMonth: previous
        }
      };

      res.json(createResponse(
        true,
        'Performance metrics retrieved successfully',
        metrics
      ));
    } catch (error) {
      console.error('Performance metrics error:', error);
      next(error);
    }
  },

  // Export enquiries
  exportEnquiries: async (req, res, next) => {
    try {
      const { format = 'json' } = req.query;
      
      const enquiries = await Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(100); // Limit for demo

      if (format === 'csv') {
        const csvHeaders = 'ID,Name,Email,Phone,Service,Status,Created At\n';
        const csvRows = enquiries.map(e => {
          return [
            e._id,
            `"${e.name}"`,
            e.email,
            e.phone,
            `"${e.service}"`,
            e.status,
            e.createdAt.toISOString()
          ].join(',');
        }).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="enquiries-${Date.now()}.csv"`);
        res.send(csvHeaders + csvRows);
      } else {
        res.json(createResponse(
          true,
          'Enquiries exported successfully',
          {
            count: enquiries.length,
            enquiries: enquiries.map(e => ({
              id: e._id,
              name: e.name,
              email: e.email,
              phone: e.phone,
              service: e.service,
              status: e.status,
              createdAt: e.createdAt
            }))
          }
        ));
      }
    } catch (error) {
      console.error('Export error:', error);
      next(error);
    }
  }
};

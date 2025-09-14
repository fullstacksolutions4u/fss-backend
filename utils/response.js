
export const createResponse = (success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

/**
 * Creates a success response
 * @param {string} message - Success message
 * @param {any} data - Response data (optional)
 * @param {any} meta - Additional metadata (optional)
 * @returns {object} Success response object
 */
export const successResponse = (message, data = null, meta = null) => {
  return createResponse(true, message, data, meta);
};

/**
 * Creates an error response
 * @param {string} message - Error message
 * @param {any} data - Error data (optional)
 * @param {any} meta - Additional metadata (optional)
 * @returns {object} Error response object
 */
export const errorResponse = (message, data = null, meta = null) => {
  return createResponse(false, message, data, meta);
};

/**
 * Creates a paginated response
 * @param {boolean} success - Whether the operation was successful
 * @param {string} message - Response message
 * @param {Array} items - Array of items
 * @param {object} pagination - Pagination info
 * @returns {object} Paginated response object
 */
export const paginatedResponse = (success, message, items, pagination) => {
  return createResponse(success, message, items, {
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev
    }
  });
};

// Default export for backward compatibility
export default {
  createResponse,
  successResponse,
  errorResponse,
  paginatedResponse
};
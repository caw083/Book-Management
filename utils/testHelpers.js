
// utils/testHelpers.js
// Helper functions for testing, especially for generating random user data

/**
 * Generate a random user with unique email
 * @param {Object} overrides - Properties to override in the default user
 * @returns {Object} A user object with random values
 */
exports.generateRandomUser = (overrides = {}) => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 100000);
    
    const defaultUser = {
      name: `Test User ${timestamp}-${random}`,
      email: `test${timestamp}-${random}@example.com`,
      password: `password${random}`
    };
  
    return { ...defaultUser, ...overrides };
  };
  
  /**
   * Generate multiple random users
   * @param {number} count - Number of users to generate
   * @param {Object} overrides - Properties to override in all users
   * @returns {Array} Array of user objects
   */
  exports.generateMultipleUsers = (count, overrides = {}) => {
    const users = [];
    for (let i = 0; i < count; i++) {
      users.push(exports.generateRandomUser(overrides));
    }
    return users;
  };
  
  /**
   * Clean up testing data from database
   * This is a safer alternative to deleting all data when you don't have admin access
   * @param {Object} models - Object containing Mongoose models
   * @param {Array} testData - Array of test data objects that were created
   */
  exports.cleanupTestData = async (models, testData) => {
    try {
      // Example: If testData has user ids to delete
      if (testData.userIds && testData.userIds.length > 0 && models.User) {
        await models.User.deleteMany({ _id: { $in: testData.userIds } });
      }
      
      // Add more cleanup for other models as needed
    } catch (err) {
      console.error('Error cleaning up test data:', err);
    }
  };
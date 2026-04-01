/**
 * Validation utilities for request data
 */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters
  return password && password.length >= 6;
};

const validateRequired = (fields, data) => {
  const missing = [];
  
  for (const field of fields) {
    if (!data[field] || data[field].toString().trim() === '') {
      missing.push(field);
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing
  };
};

const validateRole = (role) => {
  const validRoles = ['admin', 'family', 'caretaker'];
  return validRoles.includes(role);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateRequired,
  validateRole
};

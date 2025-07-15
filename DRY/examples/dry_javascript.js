// DRY Principle Example in JavaScript
// Use Case: User management system with validation and formatting

// ❌ WET (Write Everything Twice) - BEFORE DRY
// This code violates DRY principles with lots of duplication

class UserManagerWET {
  createUser(userData) {
    // Repeated validation logic
    if (!userData.email || userData.email.length < 5) {
      throw new Error("Invalid email");
    }
    if (!userData.name || userData.name.length < 2) {
      throw new Error("Invalid name");
    }
    if (!userData.password || userData.password.length < 8) {
      throw new Error("Password too short");
    }
    
    // Repeated formatting logic
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log(`User created: ${user.name} (${user.email})`);
    return user;
  }
  
  updateUser(userId, userData) {
    // Same validation logic repeated!
    if (!userData.email || userData.email.length < 5) {
      throw new Error("Invalid email");
    }
    if (!userData.name || userData.name.length < 2) {
      throw new Error("Invalid name");
    }
    if (userData.password && userData.password.length < 8) {
      throw new Error("Password too short");
    }
    
    // Same formatting logic repeated!
    const updatedUser = {
      id: userId,
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      password: userData.password,
      updatedAt: new Date().toISOString()
    };
    
    console.log(`User updated: ${updatedUser.name} (${updatedUser.email})`);
    return updatedUser;
  }
}

// ✅ DRY - AFTER applying DRY principles
// Eliminated duplication through extraction and reusable components

// 1. Extract constants (avoid magic numbers/strings)
const VALIDATION_RULES = {
  EMAIL_MIN_LENGTH: 5,
  NAME_MIN_LENGTH: 2,
  PASSWORD_MIN_LENGTH: 8
};

// 2. Extract utility functions
class ValidationUtils {
  static validateEmail(email) {
    if (!email || email.length < VALIDATION_RULES.EMAIL_MIN_LENGTH) {
      throw new Error("Invalid email");
    }
  }
  
  static validateName(name) {
    if (!name || name.length < VALIDATION_RULES.NAME_MIN_LENGTH) {
      throw new Error("Invalid name");
    }
  }
  
  static validatePassword(password, required = true) {
    if (required && (!password || password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH)) {
      throw new Error("Password too short");
    }
    if (!required && password && password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      throw new Error("Password too short");
    }
  }
}

class FormattingUtils {
  static formatEmail(email) {
    return email.toLowerCase().trim();
  }
  
  static formatName(name) {
    return name.trim();
  }
  
  static generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
  
  static getCurrentTimestamp() {
    return new Date().toISOString();
  }
}

// 3. Extract common operations
class UserLogger {
  static logUserCreated(user) {
    console.log(`User created: ${user.name} (${user.email})`);
  }
  
  static logUserUpdated(user) {
    console.log(`User updated: ${user.name} (${user.email})`);
  }
}

// 4. Main class using DRY principles
class UserManagerDRY {
  // Extracted validation method (single source of truth)
  validateUserData(userData, isUpdate = false) {
    ValidationUtils.validateEmail(userData.email);
    ValidationUtils.validateName(userData.name);
    ValidationUtils.validatePassword(userData.password, !isUpdate);
  }
  
  // Extracted formatting method
  formatUserData(userData, userId = null) {
    const timestamp = FormattingUtils.getCurrentTimestamp();
    
    return {
      id: userId || FormattingUtils.generateId(),
      email: FormattingUtils.formatEmail(userData.email),
      name: FormattingUtils.formatName(userData.name),
      password: userData.password,
      ...(userId ? {} : { createdAt: timestamp }),
      updatedAt: timestamp
    };
  }
  
  createUser(userData) {
    this.validateUserData(userData);
    const user = this.formatUserData(userData);
    UserLogger.logUserCreated(user);
    return user;
  }
  
  updateUser(userId, userData) {
    this.validateUserData(userData, true);
    const updatedUser = this.formatUserData(userData, userId);
    UserLogger.logUserUpdated(updatedUser);
    return updatedUser;
  }
}

// 5. Configuration-driven approach (further DRY improvement)
class ConfigurableUserManager {
  constructor(config = {}) {
    this.config = {
      validation: {
        emailMinLength: 5,
        nameMinLength: 2,
        passwordMinLength: 8,
        ...config.validation
      },
      logging: {
        enabled: true,
        ...config.logging
      }
    };
  }
  
  validate(field, value, minLength) {
    if (!value || value.length < minLength) {
      throw new Error(`Invalid ${field}`);
    }
  }
  
  validateUserData(userData, isUpdate = false) {
    this.validate('email', userData.email, this.config.validation.emailMinLength);
    this.validate('name', userData.name, this.config.validation.nameMinLength);
    
    if (!isUpdate || userData.password) {
      this.validate('password', userData.password, this.config.validation.passwordMinLength);
    }
  }
  
  formatUserData(userData, userId = null) {
    const timestamp = FormattingUtils.getCurrentTimestamp();
    
    return {
      id: userId || FormattingUtils.generateId(),
      email: FormattingUtils.formatEmail(userData.email),
      name: FormattingUtils.formatName(userData.name),
      password: userData.password,
      ...(userId ? {} : { createdAt: timestamp }),
      updatedAt: timestamp
    };
  }
  
  log(message) {
    if (this.config.logging.enabled) {
      console.log(message);
    }
  }
  
  createUser(userData) {
    this.validateUserData(userData);
    const user = this.formatUserData(userData);
    this.log(`User created: ${user.name} (${user.email})`);
    return user;
  }
  
  updateUser(userId, userData) {
    this.validateUserData(userData, true);
    const updatedUser = this.formatUserData(userData, userId);
    this.log(`User updated: ${updatedUser.name} (${updatedUser.email})`);
    return updatedUser;
  }
}

// Usage Examples
console.log("=== WET Example ===");
const wetManager = new UserManagerWET();
const user1 = wetManager.createUser({
  email: "john@example.com",
  name: "John Doe",
  password: "password123"
});

console.log("\n=== DRY Example ===");
const dryManager = new UserManagerDRY();
const user2 = dryManager.createUser({
  email: "jane@example.com",
  name: "Jane Smith",
  password: "password456"
});

console.log("\n=== Configurable DRY Example ===");
const configurableManager = new ConfigurableUserManager({
  validation: {
    passwordMinLength: 12 // Custom requirement
  }
});

try {
  const user3 = configurableManager.createUser({
    email: "bob@example.com",
    name: "Bob Johnson",
    password: "short" // Will fail with custom validation
  });
} catch (error) {
  console.log(`Validation error: ${error.message}`);
}
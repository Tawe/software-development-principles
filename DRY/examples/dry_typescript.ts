// DRY Principle Example in TypeScript
// Use Case: User management system with validation and formatting

// Define types first
interface UserData {
  email: string;
  name: string;
  password?: string;
}

interface User extends UserData {
  id: string;
  createdAt?: string;
  updatedAt: string;
}

interface ValidationConfig {
  emailMinLength: number;
  nameMinLength: number;
  passwordMinLength: number;
  emailPattern: RegExp;
}

interface LoggingConfig {
  enabled: boolean;
  level: "info" | "warn" | "error";
}

interface UserManagerConfig {
  validation: ValidationConfig;
  logging: LoggingConfig;
}

// ❌ WET (Write Everything Twice) - BEFORE DRY
// This code violates DRY principles with lots of duplication

class UserManagerWET {
  createUser(userData: UserData): User {
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
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log(`User created: ${user.name} (${user.email})`);
    return user;
  }

  updateUser(userId: string, userData: UserData): User {
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
    const updatedUser: User = {
      id: userId,
      email: userData.email.toLowerCase().trim(),
      name: userData.name.trim(),
      password: userData.password,
      updatedAt: new Date().toISOString(),
    };

    console.log(`User updated: ${updatedUser.name} (${updatedUser.email})`);
    return updatedUser;
  }
}

// ✅ DRY - AFTER applying DRY principles
// Eliminated duplication through extraction and reusable components

// 1. Extract constants (avoid magic numbers/strings)
const VALIDATION_RULES: ValidationConfig = {
  emailMinLength: 5,
  nameMinLength: 2,
  passwordMinLength: 8,
  emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
};

// 2. Extract utility classes with proper typing
class ValidationUtils {
  static validateEmail(email: string): void {
    if (!email || email.length < VALIDATION_RULES.emailMinLength) {
      throw new Error("Invalid email");
    }
    if (!VALIDATION_RULES.emailPattern.test(email)) {
      throw new Error("Invalid email format");
    }
  }

  static validateName(name: string): void {
    if (!name || name.length < VALIDATION_RULES.nameMinLength) {
      throw new Error("Invalid name");
    }
  }

  static validatePassword(password: string, required: boolean = true): void {
    if (
      required &&
      (!password || password.length < VALIDATION_RULES.passwordMinLength)
    ) {
      throw new Error("Password too short");
    }
    if (
      !required &&
      password &&
      password.length < VALIDATION_RULES.passwordMinLength
    ) {
      throw new Error("Password too short");
    }
  }

  // Generic validation method to reduce duplication
  static validateField<T>(
    value: T,
    fieldName: string,
    validator: (value: T) => boolean,
    errorMessage?: string
  ): void {
    if (!validator(value)) {
      throw new Error(errorMessage || `Invalid ${fieldName}`);
    }
  }
}

class FormattingUtils {
  static formatEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static formatName(name: string): string {
    return name.trim();
  }

  static generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }
}

// 3. Extract logging functionality with proper typing
class UserLogger {
  private static isEnabled: boolean = true;

  static configure(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  static logUserCreated(user: User): void {
    if (this.isEnabled) {
      console.log(`User created: ${user.name} (${user.email})`);
    }
  }

  static logUserUpdated(user: User): void {
    if (this.isEnabled) {
      console.log(`User updated: ${user.name} (${user.email})`);
    }
  }

  static log(message: string, level: "info" | "warn" | "error" = "info"): void {
    if (this.isEnabled) {
      console[level](message);
    }
  }
}

// 4. Abstract base class with common functionality
abstract class BaseUserManager {
  protected validateUserData(
    userData: UserData,
    isUpdate: boolean = false
  ): void {
    ValidationUtils.validateEmail(userData.email);
    ValidationUtils.validateName(userData.name);
    ValidationUtils.validatePassword(userData.password || "", !isUpdate);
  }

  protected formatUserData(userData: UserData, userId?: string): User {
    const timestamp = FormattingUtils.getCurrentTimestamp();

    const user: User = {
      id: userId || FormattingUtils.generateId(),
      email: FormattingUtils.formatEmail(userData.email),
      name: FormattingUtils.formatName(userData.name),
      password: userData.password,
      updatedAt: timestamp,
    };

    if (!userId) {
      user.createdAt = timestamp;
    }

    return user;
  }
}

// 5. Main class using DRY principles
class UserManagerDRY extends BaseUserManager {
  createUser(userData: UserData): User {
    this.validateUserData(userData);
    const user = this.formatUserData(userData);
    UserLogger.logUserCreated(user);
    return user;
  }

  updateUser(userId: string, userData: UserData): User {
    this.validateUserData(userData, true);
    const updatedUser = this.formatUserData(userData, userId);
    UserLogger.logUserUpdated(updatedUser);
    return updatedUser;
  }
}

// 6. Configuration-driven approach (further DRY improvement)
class ConfigurableUserManager {
  private config: UserManagerConfig;

  constructor(config?: Partial<UserManagerConfig>) {
    this.config = {
      validation: {
        emailMinLength: 5,
        nameMinLength: 2,
        passwordMinLength: 8,
        emailPattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        ...config?.validation,
      },
      logging: {
        enabled: true,
        level: "info",
        ...config?.logging,
      },
    };
  }

  private validateField(
    fieldName: string,
    value: string,
    minLength: number
  ): void {
    if (!value || value.length < minLength) {
      throw new Error(`Invalid ${fieldName}`);
    }
  }

  private validateUserData(
    userData: UserData,
    isUpdate: boolean = false
  ): void {
    this.validateField(
      "email",
      userData.email,
      this.config.validation.emailMinLength
    );

    if (!this.config.validation.emailPattern.test(userData.email)) {
      throw new Error("Invalid email format");
    }

    this.validateField(
      "name",
      userData.name,
      this.config.validation.nameMinLength
    );

    if (!isUpdate || userData.password) {
      this.validateField(
        "password",
        userData.password || "",
        this.config.validation.passwordMinLength
      );
    }
  }

  private formatUserData(userData: UserData, userId?: string): User {
    const timestamp = FormattingUtils.getCurrentTimestamp();

    const user: User = {
      id: userId || FormattingUtils.generateId(),
      email: FormattingUtils.formatEmail(userData.email),
      name: FormattingUtils.formatName(userData.name),
      password: userData.password,
      updatedAt: timestamp,
    };

    if (!userId) {
      user.createdAt = timestamp;
    }

    return user;
  }

  private log(message: string): void {
    if (this.config.logging.enabled) {
      console[this.config.logging.level](message);
    }
  }

  createUser(userData: UserData): User {
    this.validateUserData(userData);
    const user = this.formatUserData(userData);
    this.log(`User created: ${user.name} (${user.email})`);
    return user;
  }

  updateUser(userId: string, userData: UserData): User {
    this.validateUserData(userData, true);
    const updatedUser = this.formatUserData(userData, userId);
    this.log(`User updated: ${updatedUser.name} (${updatedUser.email})`);
    return updatedUser;
  }
}

// 7. Advanced DRY: Generic utilities and decorators
class GenericValidator<T> {
  private rules: Array<(value: T) => boolean> = [];
  private errorMessage: string;

  constructor(errorMessage: string) {
    this.errorMessage = errorMessage;
  }

  addRule(rule: (value: T) => boolean): this {
    this.rules.push(rule);
    return this;
  }

  validate(value: T): void {
    for (const rule of this.rules) {
      if (!rule(value)) {
        throw new Error(this.errorMessage);
      }
    }
  }
}

// Decorator for method logging
function LogExecution(
  target: any,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const method = descriptor.value;

  descriptor.value = function (...args: any[]) {
    console.log(`Executing ${propertyName}...`);
    const result = method.apply(this, args);
    console.log(`Completed ${propertyName}`);
    return result;
  };
}

// Decorator for input validation
function ValidateInput(validationFn: (instance: any, ...args: any[]) => void) {
  return function (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
      validationFn(this, ...args);
      return method.apply(this, args);
    };
  };
}

// 8. Template method pattern for further DRY
abstract class TemplateUserManager {
  // Template method - defines the algorithm structure
  public processUser(userData: UserData, userId?: string): User {
    this.validateInput(userData, !!userId);
    const user = this.formatUser(userData, userId);
    this.logOperation(user, !!userId);
    this.performAdditionalOperations(user);
    return user;
  }

  protected abstract validateInput(userData: UserData, isUpdate: boolean): void;
  protected abstract formatUser(userData: UserData, userId?: string): User;
  protected abstract logOperation(user: User, isUpdate: boolean): void;

  // Hook method - can be overridden by subclasses
  protected performAdditionalOperations(user: User): void {
    // Default implementation - do nothing
  }
}

class ConcreteUserManager extends TemplateUserManager {
  protected validateInput(userData: UserData, isUpdate: boolean): void {
    ValidationUtils.validateEmail(userData.email);
    ValidationUtils.validateName(userData.name);
    ValidationUtils.validatePassword(userData.password || "", !isUpdate);
  }

  protected formatUser(userData: UserData, userId?: string): User {
    const timestamp = FormattingUtils.getCurrentTimestamp();

    return {
      id: userId || FormattingUtils.generateId(),
      email: FormattingUtils.formatEmail(userData.email),
      name: FormattingUtils.formatName(userData.name),
      password: userData.password,
      updatedAt: timestamp,
      ...(userId ? {} : { createdAt: timestamp }),
    };
  }

  protected logOperation(user: User, isUpdate: boolean): void {
    const operation = isUpdate ? "updated" : "created";
    console.log(`User ${operation}: ${user.name} (${user.email})`);
  }

  // Override hook method for additional functionality
  protected performAdditionalOperations(user: User): void {
    // Could send welcome email, update analytics, etc.
    console.log(`Performing additional operations for user: ${user.id}`);
  }

  createUser(userData: UserData): User {
    return this.processUser(userData);
  }

  updateUser(userId: string, userData: UserData): User {
    return this.processUser(userData, userId);
  }
}

// 9. Factory pattern to reduce instantiation duplication
class UserManagerFactory {
  private static instances = new Map<string, ConfigurableUserManager>();

  static createManager(
    type: "basic" | "strict" | "lenient",
    customConfig?: Partial<UserManagerConfig>
  ): ConfigurableUserManager {
    const key = `${type}_${JSON.stringify(customConfig || {})}`;

    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    const configs = {
      basic: {},
      strict: {
        validation: {
          passwordMinLength: 12,
          emailMinLength: 8,
        },
      },
      lenient: {
        validation: {
          passwordMinLength: 6,
          nameMinLength: 1,
        },
      },
    };

    const config = { ...configs[type], ...customConfig };
    const manager = new ConfigurableUserManager(config);
    this.instances.set(key, manager);

    return manager;
  }
}

// Usage Examples
console.log("=== WET Example ===");
const wetManager = new UserManagerWET();
const user1 = wetManager.createUser({
  email: "john@example.com",
  name: "John Doe",
  password: "password123",
});

console.log("\n=== DRY Example ===");
const dryManager = new UserManagerDRY();
const user2 = dryManager.createUser({
  email: "jane@example.com",
  name: "Jane Smith",
  password: "password456",
});

console.log("\n=== Configurable DRY Example ===");
const configurableManager = new ConfigurableUserManager({
  validation: {
    passwordMinLength: 12, // Custom requirement
  },
});

try {
  const user3 = configurableManager.createUser({
    email: "bob@example.com",
    name: "Bob Johnson",
    password: "short", // Will fail with custom validation
  });
} catch (error) {
  console.log(`Validation error: ${(error as Error).message}`);
}

console.log("\n=== Factory Pattern Example ===");
const strictManager = UserManagerFactory.createManager("strict");
const lenientManager = UserManagerFactory.createManager("lenient");

console.log("\n=== Template Method Example ===");
const templateManager = new ConcreteUserManager();
const user4 = templateManager.createUser({
  email: "alice@example.com",
  name: "Alice Wonder",
  password: "wonderland123",
});

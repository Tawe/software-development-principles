# DRY Principle Example in Python
# Use Case: User management system with validation and formatting

import re
import uuid
from datetime import datetime
from typing import Dict, Optional, Any
from dataclasses import dataclass
from abc import ABC, abstractmethod

# ❌ WET (Write Everything Twice) - BEFORE DRY
# This code violates DRY principles with lots of duplication

class UserManagerWET:
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        # Repeated validation logic
        if not user_data.get('email') or len(user_data['email']) < 5:
            raise ValueError("Invalid email")
        if not user_data.get('name') or len(user_data['name']) < 2:
            raise ValueError("Invalid name")
        if not user_data.get('password') or len(user_data['password']) < 8:
            raise ValueError("Password too short")
        
        # Repeated formatting logic
        user = {
            'id': str(uuid.uuid4()),
            'email': user_data['email'].lower().strip(),
            'name': user_data['name'].strip(),
            'password': user_data['password'],
            'created_at': datetime.now().isoformat(),
            'updated_at': datetime.now().isoformat()
        }
        
        print(f"User created: {user['name']} ({user['email']})")
        return user
    
    def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        # Same validation logic repeated!
        if not user_data.get('email') or len(user_data['email']) < 5:
            raise ValueError("Invalid email")
        if not user_data.get('name') or len(user_data['name']) < 2:
            raise ValueError("Invalid name")
        if user_data.get('password') and len(user_data['password']) < 8:
            raise ValueError("Password too short")
        
        # Same formatting logic repeated!
        updated_user = {
            'id': user_id,
            'email': user_data['email'].lower().strip(),
            'name': user_data['name'].strip(),
            'password': user_data.get('password'),
            'updated_at': datetime.now().isoformat()
        }
        
        print(f"User updated: {updated_user['name']} ({updated_user['email']})")
        return updated_user

# ✅ DRY - AFTER applying DRY principles
# Eliminated duplication through extraction and reusable components

# 1. Extract constants (avoid magic numbers/strings)
@dataclass
class ValidationRules:
    EMAIL_MIN_LENGTH: int = 5
    NAME_MIN_LENGTH: int = 2
    PASSWORD_MIN_LENGTH: int = 8
    EMAIL_PATTERN: str = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

# 2. Extract utility classes
class ValidationUtils:
    @staticmethod
    def validate_email(email: str) -> None:
        if not email or len(email) < ValidationRules.EMAIL_MIN_LENGTH:
            raise ValueError("Invalid email")
        if not re.match(ValidationRules.EMAIL_PATTERN, email):
            raise ValueError("Invalid email format")
    
    @staticmethod
    def validate_name(name: str) -> None:
        if not name or len(name) < ValidationRules.NAME_MIN_LENGTH:
            raise ValueError("Invalid name")
    
    @staticmethod
    def validate_password(password: str, required: bool = True) -> None:
        if required and (not password or len(password) < ValidationRules.PASSWORD_MIN_LENGTH):
            raise ValueError("Password too short")
        if not required and password and len(password) < ValidationRules.PASSWORD_MIN_LENGTH:
            raise ValueError("Password too short")

class FormattingUtils:
    @staticmethod
    def format_email(email: str) -> str:
        return email.lower().strip()
    
    @staticmethod
    def format_name(name: str) -> str:
        return name.strip()
    
    @staticmethod
    def generate_id() -> str:
        return str(uuid.uuid4())
    
    @staticmethod
    def get_current_timestamp() -> str:
        return datetime.now().isoformat()

# 3. Extract logging functionality
class UserLogger:
    @staticmethod
    def log_user_created(user: Dict[str, Any]) -> None:
        print(f"User created: {user['name']} ({user['email']})")
    
    @staticmethod
    def log_user_updated(user: Dict[str, Any]) -> None:
        print(f"User updated: {user['name']} ({user['email']})")

# 4. Base class with common functionality
class BaseUserManager(ABC):
    def validate_user_data(self, user_data: Dict[str, Any], is_update: bool = False) -> None:
        """Single source of truth for validation"""
        ValidationUtils.validate_email(user_data.get('email', ''))
        ValidationUtils.validate_name(user_data.get('name', ''))
        ValidationUtils.validate_password(user_data.get('password', ''), not is_update)
    
    def format_user_data(self, user_data: Dict[str, Any], user_id: Optional[str] = None) -> Dict[str, Any]:
        """Single source of truth for formatting"""
        timestamp = FormattingUtils.get_current_timestamp()
        
        formatted_data = {
            'id': user_id or FormattingUtils.generate_id(),
            'email': FormattingUtils.format_email(user_data['email']),
            'name': FormattingUtils.format_name(user_data['name']),
            'password': user_data.get('password'),
            'updated_at': timestamp
        }
        
        if not user_id:  # New user
            formatted_data['created_at'] = timestamp
            
        return formatted_data

# 5. Main class using DRY principles
class UserManagerDRY(BaseUserManager):
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        self.validate_user_data(user_data)
        user = self.format_user_data(user_data)
        UserLogger.log_user_created(user)
        return user
    
    def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        self.validate_user_data(user_data, is_update=True)
        updated_user = self.format_user_data(user_data, user_id)
        UserLogger.log_user_updated(updated_user)
        return updated_user

# 6. Configuration-driven approach (further DRY improvement)
@dataclass
class UserManagerConfig:
    email_min_length: int = 5
    name_min_length: int = 2
    password_min_length: int = 8
    logging_enabled: bool = True
    email_pattern: str = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

class ConfigurableUserManager:
    def __init__(self, config: Optional[UserManagerConfig] = None):
        self.config = config or UserManagerConfig()
    
    def _validate_field(self, field_name: str, value: str, min_length: int) -> None:
        """Generic validation method - single source of truth"""
        if not value or len(value) < min_length:
            raise ValueError(f"Invalid {field_name}")
    
    def validate_user_data(self, user_data: Dict[str, Any], is_update: bool = False) -> None:
        email = user_data.get('email', '')
        name = user_data.get('name', '')
        password = user_data.get('password', '')
        
        self._validate_field('email', email, self.config.email_min_length)
        if not re.match(self.config.email_pattern, email):
            raise ValueError("Invalid email format")
        
        self._validate_field('name', name, self.config.name_min_length)
        
        if not is_update or password:
            self._validate_field('password', password, self.config.password_min_length)
    
    def format_user_data(self, user_data: Dict[str, Any], user_id: Optional[str] = None) -> Dict[str, Any]:
        timestamp = FormattingUtils.get_current_timestamp()
        
        formatted_data = {
            'id': user_id or FormattingUtils.generate_id(),
            'email': FormattingUtils.format_email(user_data['email']),
            'name': FormattingUtils.format_name(user_data['name']),
            'password': user_data.get('password'),
            'updated_at': timestamp
        }
        
        if not user_id:
            formatted_data['created_at'] = timestamp
            
        return formatted_data
    
    def _log(self, message: str) -> None:
        """Configurable logging"""
        if self.config.logging_enabled:
            print(message)
    
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        self.validate_user_data(user_data)
        user = self.format_user_data(user_data)
        self._log(f"User created: {user['name']} ({user['email']})")
        return user
    
    def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        self.validate_user_data(user_data, is_update=True)
        updated_user = self.format_user_data(user_data, user_id)
        self._log(f"User updated: {updated_user['name']} ({updated_user['email']})")
        return updated_user

# 7. Advanced DRY: Decorator pattern for cross-cutting concerns
from functools import wraps

def log_execution(func):
    """Decorator to avoid repeating logging logic"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Executing {func.__name__}...")
        result = func(*args, **kwargs)
        print(f"Completed {func.__name__}")
        return result
    return wrapper

def validate_input(validation_func):
    """Decorator to avoid repeating validation logic"""
    def decorator(func):
        @wraps(func)
        def wrapper(self, *args, **kwargs):
            validation_func(self, *args, **kwargs)
            return func(self, *args, **kwargs)
        return wrapper
    return decorator

class AdvancedUserManager:
    def __init__(self, config: Optional[UserManagerConfig] = None):
        self.config = config or UserManagerConfig()
    
    def _validate_create_input(self, user_data: Dict[str, Any]) -> None:
        # Validation logic extracted to avoid repetition
        pass
    
    def _validate_update_input(self, user_id: str, user_data: Dict[str, Any]) -> None:
        # Validation logic extracted to avoid repetition
        pass
    
    @log_execution
    @validate_input(_validate_create_input)
    def create_user(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        # Clean method focused only on core logic
        return self.format_user_data(user_data)
    
    @log_execution
    @validate_input(_validate_update_input)
    def update_user(self, user_id: str, user_data: Dict[str, Any]) -> Dict[str, Any]:
        # Clean method focused only on core logic
        return self.format_user_data(user_data, user_id)

# Usage Examples
if __name__ == "__main__":
    print("=== WET Example ===")
    wet_manager = UserManagerWET()
    user1 = wet_manager.create_user({
        'email': 'john@example.com',
        'name': 'John Doe',
        'password': 'password123'
    })
    
    print("\n=== DRY Example ===")
    dry_manager = UserManagerDRY()
    user2 = dry_manager.create_user({
        'email': 'jane@example.com',
        'name': 'Jane Smith',
        'password': 'password456'
    })
    
    print("\n=== Configurable DRY Example ===")
    custom_config = UserManagerConfig(
        password_min_length=12,  # Custom requirement
        logging_enabled=True
    )
    configurable_manager = ConfigurableUserManager(custom_config)
    
    try:
        user3 = configurable_manager.create_user({
            'email': 'bob@example.com',
            'name': 'Bob Johnson',
            'password': 'short'  # Will fail with custom validation
        })
    except ValueError as e:
        print(f"Validation error: {e}")
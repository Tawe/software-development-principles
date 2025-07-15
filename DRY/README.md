# 🔄 DRY Principle

The **DRY** principle stands for "Don't Repeat Yourself" and is a fundamental guideline for writing maintainable, efficient, and scalable code. Coined by Andy Hunt and Dave Thomas in "The Pragmatic Programmer," this principle emphasizes eliminating code duplication and creating reusable components.

The core idea is simple: **"Every piece of knowledge must have a single, unambiguous, authoritative representation within a system."**

---

## 📖 Principle Overview

### 🔄 DRY — Don't Repeat Yourself

**Every piece of knowledge should have a single, unambiguous representation in your system.**  
When you find yourself writing the same code multiple times, it's time to extract it into a reusable function, class, or module. This reduces maintenance burden, minimizes bugs, and improves consistency.

**Key Benefits:**

- **Maintainability**: Changes only need to be made in one place
- **Consistency**: Uniform behavior across your application
- **Efficiency**: Less code to write, test, and debug
- **Reliability**: Fewer places for bugs to hide

**Common Violations:**

- Copy-pasting code blocks
- Hardcoding the same values multiple times
- Repeating similar logic in different functions
- Duplicate validation rules
- Identical error handling patterns

---

## 🚫 Anti-Pattern: WET Code

**WET** stands for "Write Everything Twice" or "We Enjoy Typing" — the opposite of DRY. WET code is characterized by:

- Duplicated logic across multiple functions
- Copy-pasted code blocks
- Hardcoded values scattered throughout the codebase
- Repeated patterns without abstraction

---

## 🎯 DRY Strategies

### 1. **Extract Functions**

Move repeated code blocks into reusable functions.

### 2. **Create Constants**

Replace magic numbers and strings with named constants.

### 3. **Use Configuration Files**

Store repeated values in configuration objects or files.

### 4. **Implement Utility Classes**

Create helper classes for common operations.

### 5. **Leverage Inheritance & Composition**

Use object-oriented patterns to share behavior.

### 6. **Apply Design Patterns**

Use templates, decorators, and other patterns to reduce repetition.

---

## 💡 Examples

You can find practical examples of DRY principles in multiple languages in the `examples/` folder:

- `dry_javascript.js` - JavaScript implementation
- `dry_python.py` - Python implementation
- `dry_typescript.ts` - TypeScript implementation

---

## ⚖️ Balance: When NOT to DRY

Remember that DRY is a guideline, not a rigid rule. Sometimes a little duplication is better than premature abstraction:

- **Coincidental Duplication**: Code that looks similar but serves different purposes
- **Premature Abstraction**: Creating abstractions before understanding the full pattern
- **Over-Engineering**: Making code more complex than necessary

**Rule of Three**: Consider refactoring when you see the same pattern three times.

---

## 🔗 Related Principles

DRY works well with other software engineering principles:

- **SOLID** principles for better object-oriented design
- **KISS** (Keep It Simple, Stupid) for simplicity
- **YAGNI** (You Aren't Gonna Need It) to avoid over-engineering
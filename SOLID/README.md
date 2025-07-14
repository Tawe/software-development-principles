# 🧱 SOLID Principles

The **SOLID** principles are five foundational guidelines for writing maintainable, scalable, and robust object-oriented software. Coined by Robert C. Martin (Uncle Bob), these principles help developers avoid code rot, reduce coupling, and improve clarity.

Each letter in "SOLID" stands for one principle:

---

## 📖 Principles Overview

### 🧩 S — Single Responsibility Principle (SRP)
**A class should have one, and only one, reason to change.**  
Each module or class should be focused on a single task or responsibility. When a class has too many responsibilities, it's harder to modify, test, or extend.

---

### 🧳 O — Open/Closed Principle (OCP)
**Software entities should be open for extension, but closed for modification.**  
You should be able to extend a class’s behavior without modifying its source code — often done using polymorphism or composition.

---

### 🪞 L — Liskov Substitution Principle (LSP)
**Subtypes must be substitutable for their base types.**  
Objects of a superclass should be replaceable with objects of a subclass without breaking the application. Violating this causes unexpected behavior and subtle bugs.

---

### 🧃 I — Interface Segregation Principle (ISP)
**Clients should not be forced to depend on interfaces they do not use.**  
It's better to have several small, specific interfaces than one large, general-purpose one. This keeps classes focused and avoids implementing unused methods.

---

### 🧪 D — Dependency Inversion Principle (DIP)
**Depend on abstractions, not on concretions.**  
High-level modules should not depend on low-level modules. Both should depend on abstractions. This decouples your code and improves testability.

---

## 💡 Examples

You can find practical examples of each principle in multiple languages in the `examples/` folder:


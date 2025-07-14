// SOLID Principles Example in JavaScript
// Use Case: Sending notifications (email, SMS, push)

// ------------------------
// S — Single Responsibility Principle
// Each class has one responsibility
// ------------------------

class Message {
  constructor(content) {
    this.content = content;
  }
}

class EmailSender {
  send(message) {
    console.log(`Sending EMAIL: ${message.content}`);
  }
}

class SMSSender {
  send(message) {
    console.log(`Sending SMS: ${message.content}`);
  }
}

// ------------------------
// O — Open/Closed Principle
// NotificationService is open for extension (add new senders)
// but closed for modification
// ------------------------

class NotificationService {
  constructor(senders) {
    this.senders = senders; // Array of sender objects
  }

  notify(message) {
    this.senders.forEach((sender) => sender.send(message));
  }
}

// ------------------------
// L — Liskov Substitution Principle
// All senders can be used interchangeably without breaking logic
// ------------------------

class PushSender {
  send(message) {
    console.log(`Sending PUSH: ${message.content}`);
  }
}

// ------------------------
// I — Interface Segregation Principle
// Instead of one bloated sender interface, each sender implements only what it needs
// (JavaScript doesn't have interfaces natively, but we use convention here)
// ------------------------

// All sender classes only need `send()` — nothing extra is forced on them.

// ------------------------
// D — Dependency Inversion Principle
// High-level NotificationService depends on abstract senders, not concrete ones
// ------------------------

// Usage

const message = new Message("Welcome to the platform!");
const emailSender = new EmailSender();
const smsSender = new SMSSender();
const pushSender = new PushSender();

const notificationService = new NotificationService([
  emailSender,
  smsSender,
  pushSender,
]);

notificationService.notify(message);

// SOLID Principles Example in TypeScript
// Use Case: Sending notifications (email, SMS, push)

// ------------------------
// S — Single Responsibility Principle
// Each class or interface has one responsibility
// ------------------------

class Message {
  constructor(public content: string) {}
}

// ------------------------
// I — Interface Segregation Principle
// Define minimal interface required by all senders
// ------------------------

interface Sender {
  send(message: Message): void;
}

// ------------------------
// L — Liskov Substitution Principle
// All classes implement the same interface and can be used interchangeably
// ------------------------

class EmailSender implements Sender {
  send(message: Message): void {
    console.log(`Sending EMAIL: ${message.content}`);
  }
}

class SMSSender implements Sender {
  send(message: Message): void {
    console.log(`Sending SMS: ${message.content}`);
  }
}

class PushSender implements Sender {
  send(message: Message): void {
    console.log(`Sending PUSH: ${message.content}`);
  }
}

// ------------------------
// D — Dependency Inversion Principle
// Depend on abstraction (Sender), not concrete implementations
// O — Open/Closed Principle
// Add new senders without modifying existing logic
// ------------------------

class NotificationService {
  constructor(private senders: Sender[]) {}

  notify(message: Message): void {
    this.senders.forEach(sender => sender.send(message));
  }
}

// ------------------------
// Usage Example
// ------------------------

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

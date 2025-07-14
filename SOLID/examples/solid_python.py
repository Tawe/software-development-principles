# SOLID Principles Example in Python
# Use Case: Sending notifications (email, SMS, push)

from abc import ABC, abstractmethod

# ------------------------
# S — Single Responsibility Principle
# Each class handles one responsibility
# ------------------------

class Message:
    def __init__(self, content: str):
        self.content = content

class EmailSender:
    def send(self, message: Message):
        print(f"Sending EMAIL: {message.content}")

class SMSSender:
    def send(self, message: Message):
        print(f"Sending SMS: {message.content}")

# ------------------------
# O — Open/Closed Principle
# NotificationService can be extended with new senders
# without being modified
# ------------------------

class NotificationService:
    def __init__(self, senders: list):
        self.senders = senders  # List of sender objects

    def notify(self, message: Message):
        for sender in self.senders:
            sender.send(message)

# ------------------------
# L — Liskov Substitution Principle
# All senders can be substituted without breaking NotificationService
# ------------------------

class PushSender:
    def send(self, message: Message):
        print(f"Sending PUSH: {message.content}")

# ------------------------
# I — Interface Segregation Principle
# Each sender only needs to implement send()
# ------------------------

# Python doesn't enforce interfaces, but we can use abstract base classes for clarity

class SenderInterface(ABC):
    @abstractmethod
    def send(self, message: Message):
        pass

# EmailSender, SMSSender, and PushSender already conform to this "interface"

# ------------------------
# D — Dependency Inversion Principle
# NotificationService depends on abstractions (SenderInterface),
# not concrete implementations
# ------------------------

# Usage example:

if __name__ == "__main__":
    message = Message("Welcome to the platform!")

    email_sender = EmailSender()
    sms_sender = SMSSender()
    push_sender = PushSender()

    notification_service = NotificationService([
        email_sender,
        sms_sender,
        push_sender
    ])

    notification_service.notify(message)

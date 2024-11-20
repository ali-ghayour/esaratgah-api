class SmsService extends MessageService {
  constructor() {
    super("SMS Service");
  }

  // Implement the abstract methods
  async sendMessage(to: string, message: string): Promise<{ result: boolean }> {
    // Implementation for sending SMS
    console.log(`Sending SMS to ${to}: ${message}`);
    return Promise.resolve({ result: true });
  }

  async receiveMessage(): Promise<string> {
    // Implementation for receiving SMS
    console.log("Receiving SMS...");
    return Promise.resolve("SMS message received");
  }
}

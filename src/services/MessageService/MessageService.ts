abstract class MessageService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  // Abstract method for sending a message
  abstract sendMessage(
    to: string,
    message: string
  ): Promise<{ result: boolean }>;

  // Abstract method for receiving a message
  abstract receiveMessage(): Promise<string>;

  // A concrete method for logging messages
  logMessage(message: string): void {
    console.log(`[${this.serviceName}] ${message}`);
  }
}

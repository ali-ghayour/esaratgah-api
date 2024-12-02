import bcrypt from "bcrypt";

class BcryptHelper {
  private saltRounds: number;

  constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  /**
   * Hashes a plain text string (e.g., password or OTP).
   * @param plainText The text to hash.
   * @returns The hashed string.
   */
  async hash(plainText: string): Promise<string> {
    try {
      return await bcrypt.hash(plainText, this.saltRounds);
    } catch (error) {
      throw new Error(`Error hashing text`);
    }
  }

  /**
   * Compares a plain text string with a hash to check if they match.
   * @param plainText The plain text to compare.
   * @param hash The hashed string.
   * @returns True if they match, otherwise false.
   */
  async compare(plainText: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(plainText, hash);
    } catch (error) {
      throw new Error(`Error comparing text`);
    }
  }
}

export default BcryptHelper;

import jwt, { JwtPayload } from "jsonwebtoken";

export interface IJwtHelper {
  secret: string;
  expiresIn?: string | number; // Token expiration, e.g., "1h" or "7d"
}

export interface IToken extends JwtPayload {
  _id : number,
  phone_number:string
}

export class JwtHelper {
  private secret: string;
  private expiresIn: string | number | undefined;

  constructor({ secret, expiresIn }: IJwtHelper) {
    this.secret = secret;
    this.expiresIn = expiresIn;
  }

  /**
   * Generate a JWT token
   * @param payload - The payload to encode into the token
   * @returns A signed JWT token
   */
  generateToken(payload: Record<string, any>): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  /**
   * Verify a JWT token
   * @param token - The JWT token to verify
   * @returns Decoded payload if token is valid
   * @throws Error if the token is invalid or expired
   */
  verifyToken(token: string): JwtPayload | string {
    return jwt.verify(token, this.secret);
  }

  /**
   * Decode a JWT token without verifying its signature
   * @param token - The JWT token to decode
   * @returns The decoded payload
   */
  decodeToken(token: string): null | JwtPayload | string {
    return jwt.decode(token);
  }
}

export default JwtHelper;

/**
 * Generates a numeric OTP of the specified length.
 * @param length - The length of the OTP to generate.
 * @returns A string representing the OTP.
 */
export async function createNumber(length: number): Promise<string> {
  if (length <= 0) {
    throw new Error("OTP length must be greater than 0.");
  }

  const min = Math.pow(10, length - 1); // Smallest number with the desired length
  const max = Math.pow(10, length) - 1; // Largest number with the desired length

  const otp = Math.floor(Math.random() * (max - min + 1)) + min;
  return otp.toString();
}

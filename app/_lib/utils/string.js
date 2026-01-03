/**
 * Generates a random connection string of 7 characters.
 * The first 3 characters are uppercase letters (A-Z),
 * and the last 4 characters are digits (0-9).
 * @returns {string} The generated connection string.
 */
function RandomConnectionString() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let result = "";
  for (let i = 0; i < 3; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 4; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  return result;
}

export { RandomConnectionString };

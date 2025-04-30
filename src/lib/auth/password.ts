import * as argon2 from "argon2";

export const hashPassword = async (password: string) => {
  const pepper = process.env.HASH_PEPPER;

  if (!pepper) throw new Error("PEPPER ENV VARIABLE NOT FOUND.");

  try {
    const hash = await argon2.hash(password, {
      type: argon2.argon2i,
      secret: Buffer.from(pepper),
    });

    return hash;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to hash password.");
    }
  }
};

export const verifyPassword = async (password: string, hash: string) => {
  try {
    if (await argon2.verify(hash, password)) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Failed to hash verify assword.");
    }
  }
};

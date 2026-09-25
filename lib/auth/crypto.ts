import type { Credentials } from "@/types";

// NOTE: This is mock, client-side auth. Hashing keeps plaintext passwords out of
// localStorage, but anything running in the browser can be bypassed. Move
// verification to the server (route handlers / server actions + httpOnly
// session cookie) before using this with real accounts.

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

function randomString(length: number, alphabet: string) {
  const bytes = crypto.getRandomValues(new Uint32Array(length));
  return Array.from(bytes, (n) => alphabet[n % alphabet.length]).join("");
}

export function uid() {
  return randomString(12, "abcdefghijklmnopqrstuvwxyz0123456789");
}

async function hashPassword(password: string, salt: string) {
  if (!crypto?.subtle) {
    throw new Error("Web Crypto is unavailable — serve the app over HTTPS or localhost.");
  }
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(`${salt}:${password}`)));
}

export async function createCredentials(password: string): Promise<Credentials> {
  const salt = randomString(16, "abcdef0123456789");
  return { salt, passwordHash: await hashPassword(password, salt) };
}

export async function verifyPassword(password: string, credentials: Credentials) {
  return (await hashPassword(password, credentials.salt)) === credentials.passwordHash;
}

/** Readable temporary password — no ambiguous characters (0/O, 1/l/I). */
export function generatePassword(length = 8) {
  return randomString(length, "abcdefghjkmnpqrstuvwxyz23456789");
}

export const MIN_PASSWORD_LENGTH = 6;
export const USERNAME_PATTERN = /^[a-z0-9_.]{3,20}$/;

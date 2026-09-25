import type { Database, Session } from "@/types";
import { migrate } from "./migrate";
import { createSeedDb } from "./seed";

/**
 * Tiny external store backed by localStorage, read through useSyncExternalStore.
 * The server snapshot is `null` ("not loaded"), so SSR output never depends on
 * browser storage and hydration is mismatch-free. Changes made in other tabs
 * are picked up through the `storage` event.
 */

export interface StoreState {
  db: Database;
  session: Session | null;
}

// Schema changes are handled by `migrate()` (see migrate.ts) so saved accounts
// survive upgrades. Data under the legacy versioned keys is moved here once.
const DB_KEY = "reading-challenge:db";
const SESSION_KEY = "reading-challenge:session";
const LEGACY_KEYS = { db: "reading-challenge:db:v2", session: "reading-challenge:session:v2" };

let state: StoreState | null = null;
let loading: Promise<void> | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded / storage disabled: state still lives in memory for this tab.
  }
}

/** Drop sessions that point at a student who no longer exists. */
function validSession(session: Session | null, db: Database): Session | null {
  if (session?.role === "teacher") return session;
  if (session?.role === "student" && db.students.some((s) => s.id === session.studentId)) return session;
  return null;
}

function readState(db: Database): StoreState {
  return { db, session: validSession(read<Session>(SESSION_KEY), db) };
}

function moveLegacyData() {
  if (read(DB_KEY) !== null) return;
  const legacyDb = read(LEGACY_KEYS.db);
  if (legacyDb === null) return;
  write(DB_KEY, legacyDb);
  write(SESSION_KEY, read(LEGACY_KEYS.session));
  write(LEGACY_KEYS.db, null);
  write(LEGACY_KEYS.session, null);
}

async function load() {
  moveLegacyData();
  const stored = read<unknown>(DB_KEY);
  let db = migrate(stored);
  if (!db) db = await createSeedDb();
  if (db !== stored) write(DB_KEY, db);
  state = readState(db);
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key !== DB_KEY && e.key !== SESSION_KEY) return;
  const db = migrate(read<unknown>(DB_KEY));
  if (db) {
    state = readState(db);
    emit();
  }
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorage);
  loading ??= load();
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorage);
  };
}

export const getSnapshot = () => state;
export const getServerSnapshot = () => null;

/** Read the latest state outside React (e.g. inside async actions). */
export const getState = () => state;

export function setState(updater: (prev: StoreState) => StoreState) {
  if (!state) return;
  const next = updater(state);
  if (next.db !== state.db) write(DB_KEY, next.db);
  if (next.session !== state.session) write(SESSION_KEY, next.session);
  state = next;
  emit();
}

/** Wipe all local data and re-seed the demo accounts. */
export async function resetStore() {
  write(DB_KEY, null);
  write(SESSION_KEY, null);
  loading = load();
  await loading;
}

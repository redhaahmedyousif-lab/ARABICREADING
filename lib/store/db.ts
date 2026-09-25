import type { Database, Session } from "@/types";
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

// Bump the version (here and in `Database["version"]`) whenever the seed or the
// schema changes; browsers holding older data are then re-seeded.
const DB_VERSION = 2;
const DB_KEY = `reading-challenge:db:v${DB_VERSION}`;
const SESSION_KEY = `reading-challenge:session:v${DB_VERSION}`;

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

async function load() {
  let db = read<Database>(DB_KEY);
  if (db?.version !== DB_VERSION) {
    db = await createSeedDb();
    write(DB_KEY, db);
  }
  state = readState(db);
  emit();
}

function onStorage(e: StorageEvent) {
  if (e.key !== DB_KEY && e.key !== SESSION_KEY) return;
  const db = read<Database>(DB_KEY);
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

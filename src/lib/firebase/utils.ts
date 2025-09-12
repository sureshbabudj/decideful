/* eslint-disable @typescript-eslint/no-explicit-any */
import { Timestamp } from "firebase/firestore";
import { z } from "zod";

/* ---------- narrow Timestamp type ---------- */
const isClientTimestamp = (v: unknown): v is Timestamp =>
  v instanceof Timestamp;
const isAdminTimestamp = (v: unknown): v is Timestamp =>
  v?.constructor?.name === "Timestamp";

/* ---------- generic converter ---------- */
type Schema = z.ZodObject<any, any>;
type Infer<S extends Schema> = z.infer<S> & { id: string };

function convertTimestampFields(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key in obj) {
    const val = obj[key];
    if (
      (key.endsWith("At") || key.endsWith("Date")) &&
      (isClientTimestamp(val) || isAdminTimestamp(val))
    ) {
      out[key] = (val as any).toDate();
    } else if (Array.isArray(val)) {
      out[key] = val.map((item) =>
        typeof item === "object" && item !== null
          ? convertTimestampFields(item)
          : item
      );
    } else if (typeof val === "object" && val !== null) {
      out[key] = convertTimestampFields(val as Record<string, unknown>);
    } else {
      out[key] = val;
    }
  }
  return out;
}

function convertTimestamps(
  data: Record<string, unknown>,
  schema: Schema
): Record<string, unknown> {
  // Only use schema to pick keys, but conversion is handled by convertTimestampFields
  const picked: Record<string, unknown> = {};
  for (const key in schema.shape) {
    picked[key] = data[key];
  }
  return convertTimestampFields(picked);
}

export function snapToTyped<S extends Schema>(
  snap: { id: string; data: () => Record<string, unknown> }, // minimal common shape
  schema: S
): Infer<S> {
  const raw = snap.data();
  const cleaned = { ...convertTimestamps(raw, schema), id: snap.id };
  console.log("cleaned", cleaned);
  return schema.parse(cleaned) as Infer<S>;
}

export function snapsToTyped<S extends Schema>(
  snaps: { id: string; data: () => Record<string, unknown> }[],
  schema: S
): Infer<S>[] {
  return snaps.map((s) => snapToTyped(s, schema));
}

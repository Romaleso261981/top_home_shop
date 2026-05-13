import { appendFile, mkdir } from "fs/promises";
import path from "path";

export type OrderLogRecord = Record<string, unknown>;

async function appendJsonl(fileName: string, record: OrderLogRecord): Promise<boolean> {
  const dir = path.join(process.cwd(), "storage");
  const file = path.join(dir, fileName);
  const line = JSON.stringify(record) + "\n";
  try {
    await mkdir(dir, { recursive: true });
    await appendFile(file, line, { encoding: "utf8" });
    return true;
  } catch {
    return false;
  }
}

export async function logOrderReceived(record: OrderLogRecord): Promise<boolean> {
  return appendJsonl("orders.jsonl", record);
}

export async function logOrderFailure(record: OrderLogRecord): Promise<boolean> {
  return appendJsonl("orders-failed.jsonl", record);
}

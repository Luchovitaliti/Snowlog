import { createSnowLogIcon } from "@/lib/pwa-icon";

export const runtime = "edge";

export function GET() {
  return createSnowLogIcon(192);
}

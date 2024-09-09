import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

type Callback = (...args: unknown[]) => Promise<unknown>;

type Options = {
  revalidate?: number | false;
  tags?: string[];
};

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: Options = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}

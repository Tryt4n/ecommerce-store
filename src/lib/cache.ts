import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Callback = (...args: any[]) => Promise<any>;

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
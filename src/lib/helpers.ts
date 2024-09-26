export function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export function encode(data: string) {
  return Buffer.from(`${data}:`).toString("base64");
}

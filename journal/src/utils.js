// crypto API supported by Firefox and Chrome
export async function sha256(s) {
  const msgUint8 = Buffer.from(s);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  return Array.from(new Uint8Array(hashBuffer));
}

import { jwtVerify, createLocalJWKSet } from "jose";

/* ---------- 1.  Emulator verifier (local fetch) ---------- */
const EMU_BASE = "http://localhost:9099/identitytoolkit.googleapis.com/v1";

export async function verifyEmulatorToken(token: string) {
  const res = await fetch(`${EMU_BASE}/accounts:lookup?key=fake-api-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken: token }),
  });
  if (!res.ok) throw new Error("invalid token");
  const json = await res.json();
  return json.users?.[0] ?? {};
}

/* ---------- 2.  Production verifier (Google keys) ---------- */
let keyStore: ReturnType<typeof createLocalJWKSet>;

async function getKeyStore() {
  if (!keyStore) {
    const res = await fetch(
      "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
    );
    const jwks = await res.json();
    keyStore = createLocalJWKSet(jwks);
  }
  return keyStore;
}

export async function verifyProductionToken(token: string) {
  const ks = await getKeyStore();
  const { payload } = await jwtVerify(token, ks, {
    issuer: `https://securetoken.google.com/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`,
    audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
  return payload;
}

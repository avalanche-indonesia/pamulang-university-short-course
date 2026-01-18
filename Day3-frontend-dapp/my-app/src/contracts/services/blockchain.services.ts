const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;


if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

// READ VALUE (GET)
export async function getBlockchainValue() {
  const res = await fetch(`${BACKEND_URL}/blockchain/value`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain value");
  }

  return res.json();
}

// EVENTS (POST + BODY)
      // export async function getBlockchainEvents() {
      //   const res = await fetch(`${BACKEND_URL}/blockchain/events`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       fromBlock: "50602548",
      //       limitBlock: 10,
      //     }),
      //   });

      //   if (!res.ok) {
      //     throw new Error("Failed to fetch blockchain events");
      //   }

      //   return res.json();
      // }
      // type GetEventsParams = {
      //   fromBlock?: string;
      //   limitBlock?: number;
      // };
export async function getBlockchainEvents(params?: {
  fromBlock?: string;
  limitBlock?: number;
}) {
  const res = await fetch(`${BACKEND_URL}/blockchain/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fromBlock: params?.fromBlock,
      limitBlock: params?.limitBlock ?? 10,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch blockchain events");
  }

  return res.json();
}

import {
  getBlockchainValue,
  getBlockchainEvents,
} from "../services/blockchain.services";

export default async function HomePage() {
  const value = await getBlockchainValue();
  const events = await getBlockchainEvents();

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Blockchain Data</h1>

      <section>
        <h2 className="font-semibold">Latest Value</h2>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </section>

      <section>
        <h2 className="font-semibold">Events</h2>
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </section>
    </main>
  );
}

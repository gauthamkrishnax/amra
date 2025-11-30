import Link from "next/link";

export default function Home() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="bg-primary flex flex-col items-center justify-center gap-6 rounded-full p-10">
        <h1 className="text-3xl font-bold">Amra</h1>
        <Link
          href="/expense"
          className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition-all hover:scale-105 hover:shadow-lg"
        >
          Go to Expenses
        </Link>
      </div>
    </div>
  );
}

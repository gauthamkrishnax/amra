export default function ExpenseLoadingSkeleton() {
  return (
    <div className="relative min-h-dvh pb-10">
      <div className="relative">
        <div className="bg-accent h-35 rounded-b-[40] drop-shadow-2xl">
          <div className="mx-10 pt-12">
            <div className="mb-2 h-6 w-48 animate-pulse rounded bg-gray-300/50"></div>
            <div className="h-4 w-64 animate-pulse rounded bg-gray-300/30"></div>
          </div>
        </div>
        <div className="absolute right-0 -bottom-10 left-0">
          <div className="bg-accent mx-10 rounded-3xl p-5 shadow-md">
            <div className="flex justify-between">
              <div className="flex-1">
                <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-300/50"></div>
                <div className="h-3 w-32 animate-pulse rounded bg-gray-300/30"></div>
              </div>
              <div className="flex-1">
                <div className="mb-2 h-8 w-24 animate-pulse rounded bg-gray-300/50"></div>
                <div className="h-3 w-32 animate-pulse rounded bg-gray-300/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-10 mt-16">
        <div className="mb-2 h-5 w-40 animate-pulse rounded bg-gray-300/40"></div>
      </div>
      <div>
        <div className="bg-accent shadow-top max-h-96 overflow-y-auto rounded-t-[40] p-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="my-2 flex items-center justify-between gap-5 rounded-full border border-gray-300/30 px-3 py-4 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-gray-300/50"></div>
                <div className="flex flex-col gap-2">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-300/40"></div>
                  <div className="h-3 w-32 animate-pulse rounded bg-gray-300/30"></div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-5 w-16 animate-pulse rounded bg-gray-300/40"></div>
                <div className="h-3 w-20 animate-pulse rounded bg-gray-300/30"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

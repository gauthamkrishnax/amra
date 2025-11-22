export default function Loading() {
  return (
    <div className="flex grow flex-col justify-center">
      <div className="flex flex-col items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 border-gray-900"></div>
        <p className="text-2xl font-bold">Loading...</p>
      </div>
    </div>
  );
}

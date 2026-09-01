export default function AdminLoading() {
  return (
    <div className="space-y-5">
      <div className="skeleton h-9 w-56 rounded-lg" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="skeleton h-32 rounded-[14px]" />
        ))}
      </div>
      <div className="skeleton h-64 rounded-[14px]" />
    </div>
  );
}

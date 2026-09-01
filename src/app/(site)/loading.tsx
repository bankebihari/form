export default function SiteLoading() {
  return (
    <div className="container-page py-16">
      <div className="skeleton h-8 w-64 rounded-lg" />
      <div className="skeleton mt-4 h-4 w-full max-w-xl rounded" />
      <div className="skeleton mt-2 h-4 w-full max-w-md rounded" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton h-48 rounded-[14px]" />
        ))}
      </div>
    </div>
  );
}

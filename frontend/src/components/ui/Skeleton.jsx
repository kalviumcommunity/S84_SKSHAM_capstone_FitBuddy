export default function Skeleton({ className = '', count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-surface-light rounded-2xl ${className}`}
        />
      ))}
    </>
  );
}

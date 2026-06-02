type LoadingSpinnerProps = {
  className?: string;
  label?: string;
};

export default function LoadingSpinner({
  className = "",
  label = "Loading",
}: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
      role="status"
      aria-label={label}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-stone-200 border-t-stone-800" />
      {label ? (
        <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
          {label}
        </span>
      ) : null}
    </div>
  );
}

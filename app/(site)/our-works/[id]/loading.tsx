import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";

export default function WorkDetailLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5 py-24">
      <LoadingSpinner label="Loading project" />
    </div>
  );
}

import LoadingSpinner from "@/app/COMPONENTS/ui/LoadingSpinner";

export default function OurWorksLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-[#F8F8F8] px-5 py-24 lg:px-[55px]">
      <LoadingSpinner label="Loading works" />
    </div>
  );
}

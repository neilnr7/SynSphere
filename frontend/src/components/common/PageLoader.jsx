import Spinner from "@/components/ui/Spinner";

function PageLoader({
  message = "Loading...",
  fullScreen = false,
}) {
  return (
    <div
      className={`
        flex items-center justify-center
        ${fullScreen ? "min-h-screen" : "min-h-80"}
      `}
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />

        <p className="text-sm text-text-secondary">
          {message}
        </p>
      </div>
    </div>
  );
}

export default PageLoader;
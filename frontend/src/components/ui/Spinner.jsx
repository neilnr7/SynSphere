import { LoaderCircle } from "lucide-react";

const sizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

function Spinner({
  size = "md",
  className = "",
  label = "Loading",
}) {
  return (
    <LoaderCircle
      className={`
        animate-spin
        text-primary
        ${sizes[size]}
        ${className}
      `}
      role="status"
      aria-label={label}
    />
  );
}

export default Spinner;
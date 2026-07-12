import { useState } from "react";

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-xl",
};

function getInitials(name = "") {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return "?";
  }

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
}

function Avatar({
  name = "",
  src,
  alt,
  size = "md",
  className = "",
}) {
  const [imageError, setImageError] = useState(false);

  const showImage = src && !imageError;

  return (
    <div
      className={`
        inline-flex shrink-0 items-center justify-center
        overflow-hidden rounded-full
        bg-primary-light
        font-semibold text-primary
        ${sizes[size]}
        ${className}
      `}
      title={name}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || `${name} profile`}
          className="h-full w-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <span aria-hidden="true">{getInitials(name)}</span>
      )}
    </div>
  );
}

export default Avatar;
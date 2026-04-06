import { clsx } from "clsx";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  firstName: string;
  lastName: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
};

export function Avatar({
  firstName,
  lastName,
  src,
  size = "md",
  className,
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${firstName} ${lastName}`}
        className={clsx(
          "rounded-full object-cover",
          sizeStyles[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={clsx(
        "rounded-full bg-gradient-to-br from-pro-primary-light to-pro-primary/10 text-pro-primary font-semibold flex items-center justify-center ring-2 ring-pro-primary/10",
        sizeStyles[size],
        className
      )}
    >
      {getInitials(firstName, lastName)}
    </div>
  );
}

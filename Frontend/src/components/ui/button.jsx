import clsx from "clsx";

export function Button({ children, className, variant = "default", size = "default", ...props }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "outline"
          ? "border border-gray-300 bg-white hover:bg-gray-100"
          : variant === "ghost"
          ? "bg-transparent hover:bg-gray-100"
          : "bg-green-600 text-white hover:bg-green-700",
        size === "lg" ? "px-6 py-3 text-lg" : "px-4 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

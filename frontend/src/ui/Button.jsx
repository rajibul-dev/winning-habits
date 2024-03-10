export default function Button({
  children,
  href,
  category = "primary",
  size = "medium",
  isBlock = false,
  className = "",
  onClick,
  ...rest
}) {
  const buttonStyles = `${isBlock ? "block" : "inline-block"} ${isBlock ? "w-full" : "w-auto"} ${size === "big" ? "py-3.5 px-6" : size === "small" ? "py-1.5 px-4" : "py-3 px-5"} ${category === "primary" ? "bg-gray-800 text-white" : "bg-gray-300 text-black"} text-base rounded-md`;

  // anchor element
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${buttonStyles} ${className}`}
        {...rest}
      >
        {children}
      </a>
    );
  }

  // button element
  else {
    return (
      <button
        onClick={onClick}
        className={`${buttonStyles} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
}

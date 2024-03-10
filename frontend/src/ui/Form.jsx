export default function Form({ children, className, ...props }) {
  return (
    <form
      className={`border border-solid border-gray-400 bg-white ${className}`}
      {...props}
    >
      {children}
    </form>
  );
}

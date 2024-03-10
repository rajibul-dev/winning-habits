function FormRowVertical({ label, error, children, ...rest }) {
  return (
    <div className="flex flex-col" {...rest}>
      {label && (
        <label className="mb-1.5 block text-base" htmlFor={children.props.id}>
          {label}
        </label>
      )}
      {children}
      {error && <span>{error}</span>}
    </div>
  );
}

export default FormRowVertical;

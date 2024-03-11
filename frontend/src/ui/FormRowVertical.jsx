function FormRowVertical({ label, error, children, ...rest }) {
  return (
    <div {...rest}>
      {label && <label htmlFor={children.props.id}>{label}</label>}
      {children}
      {error && <span>{error}</span>}
    </div>
  );
}

export default FormRowVertical;

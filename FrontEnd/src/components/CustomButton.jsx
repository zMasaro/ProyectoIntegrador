/**
 * Componente de botón reutilizable y estricto.
 *
 * @component
 * @example
 * <Button
 *   text="Guardar"
 *   onClick={handleSave}
 *   type="submit"
 *   id="save-button"
 *   className="btn-success"
 * />
 *
 * @param {Object} props
 * @param {string} props.text
 * @param {function} props.onClick
 * @param {string} props.type
 * @param {string} props.className
 * @returns {JSX.Element}
 */
function CustomButton({ type, onClick, className, text, ...rest }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {text}
    </button>
  );
}

export default CustomButton;
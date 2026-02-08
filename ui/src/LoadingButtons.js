export default function LoadingButton({
  loading,
  children,
  ...props
}) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading && (
        <span className="lds-roller" style={{ marginRight: 8 }}>
          <div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div>
        </span>
      )}
      {children}
    </button>
  );
}
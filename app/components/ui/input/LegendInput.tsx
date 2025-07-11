function LegendInput({ type, placeholder, label }: { type: string; placeholder: string; label: string }) {
  return (
    <>
      <input type={type} className="input" placeholder={placeholder} />
      <p className="label">{label}</p>
    </>
  );
}

export default LegendInput;

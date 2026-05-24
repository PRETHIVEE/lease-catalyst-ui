const InputLabel = ({ label, htmlFor }: { label: string; htmlFor: string }) => {
  return (
    <div>
      <label
        className="text-[0.79rem] text-[#676768] "
        htmlFor={htmlFor}
        style={{ fontWeight: 400 }}
      >
        {label}
      </label>
    </div>
  );
};

export default InputLabel;

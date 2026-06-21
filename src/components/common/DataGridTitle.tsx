const DataGridTitle = ({ title }: { title: string }) => {
  return (
    <p
      style={{
        fontSize: "0.88rem",
        fontWeight: 600,
        position: "absolute",
        zIndex: 10,
        height: "44px",
        display: "flex",
        alignItems: "center",
        paddingInline: "1rem",
      }}
    >
      {title}
    </p>
  );
};

export default DataGridTitle;

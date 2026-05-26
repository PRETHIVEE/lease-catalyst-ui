type ChartTitleProps = {
  title: string;
};

const ChartTitle = ({ title }: ChartTitleProps) => {
  return (
    <h6 className="text-[0.86rem] font-medium text-font-color-primary">
      {title}
    </h6>
  );
};

export default ChartTitle;

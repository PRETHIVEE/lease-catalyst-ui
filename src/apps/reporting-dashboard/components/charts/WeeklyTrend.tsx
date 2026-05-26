import ChartTitle from "../chart-title/ChartTitle";
import ChartWidgetWrapper from "../chart-widget-wrapper/ChartWidgetWrapper";

const WeeklyTrend = () => {
  return (
    <ChartWidgetWrapper>
      <ChartTitle title="Lease: Weekly Trend — Sampled Lease Count" />
      <div className="mt-4 h-82 w-full">
        <img src="/temp/weeklychartimg.png" alt="" style={{ width: "100%" }} />
      </div>
    </ChartWidgetWrapper>
  );
};

export default WeeklyTrend;

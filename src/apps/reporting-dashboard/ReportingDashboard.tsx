import WeeklyTrend from "./components/charts/WeeklyTrend";

const ReportingDashboard = () => {
  return (
    <div className="px-4 py-2">
      <h5 className="mt-3 text-[0.98rem] font-semibold text-font-color-primary">
        Reporting Dashboard
      </h5>

      <div className="mt-4" style={{ width: "50%" }}>
        <WeeklyTrend />
      </div>
    </div>
  );
};

export default ReportingDashboard;

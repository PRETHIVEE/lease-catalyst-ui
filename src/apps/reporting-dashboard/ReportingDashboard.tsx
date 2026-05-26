import BreadCrumbs from "@/components/common/BreadCrumbs";
import WeeklyTrend from "./components/charts/WeeklyTrend";

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
  { label: "Reporting Dashboard", url: "/" },
];

const ReportingDashboard = () => {
  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
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

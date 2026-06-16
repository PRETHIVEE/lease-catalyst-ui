import { CheckCircle2, Clock3, FileText, List, XCircle } from "lucide-react";
import WidgetCard from "./components/WidgetCard";
import JobsTable from "./components/JobsTable";

const Dashboard = () => {
  return (
    <div className="p-4">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-5 xl:grid-cols-5">
        <WidgetCard
          value={5}
          variant="info"
          label="New"
          subDescription="Awaiting intake"
          icon={FileText}
        />
        <WidgetCard
          value={3}
          variant="warning"
          label="Running"
          subDescription="In progress"
          icon={Clock3}
        />
        <WidgetCard
          value={1}
          variant="error"
          label="Failed"
          subDescription="Needs review"
          icon={XCircle}
        />
        <WidgetCard
          value={85}
          variant="success"
          label="Completed"
          subDescription="Abstracted"
          icon={CheckCircle2}
        />
        <WidgetCard
          value={92}
          variant="neutral"
          label="Total"
          subDescription="All leases"
          icon={List}
        />
      </section>

      <section
        className="mt-4 shadow-sm rounded-lg"
        style={{ overflow: "hidden" }}
      >
        <JobsTable />
      </section>
    </div>
  );
};

export default Dashboard;

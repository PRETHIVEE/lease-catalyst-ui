import { useState } from "react";
import JobsTable from "./components/JobsTable";
import StatsBar from "./components/WidgetCard";

const Dashboard = () => {
  const [statusCount, setStatusCount] = useState({
    total: 0,
    running: 0,
    failed: 0,
    completed: 0,
  });
  return (
    <div className="p-4">
      <section className="w-full">
        <StatsBar
          completed={statusCount?.completed}
          failed={statusCount?.failed}
          running={statusCount?.running}
          total={statusCount?.total}
        />
      </section>

      <section
        className="mt-3 shadow-sm rounded-lg"
        style={{ overflow: "hidden" }}
      >
        <JobsTable setStatusCount={setStatusCount} />
      </section>
    </div>
  );
};

export default Dashboard;

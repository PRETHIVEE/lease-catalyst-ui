import StatusChip from "@/components/common/StatusChip";

const Test = () => {
  return (
    <div className="p-4">
      <div className="mt-4 flex flex-wrap gap-2 bg-white p-40">
        <StatusChip variant="pending" label="Pending" />
        {/* <StatusChip variant="progress" label="In progress" />
        <StatusChip variant="submitted" label="Submitted" /> */}
        <StatusChip variant="failed" label="Failed" />
        <StatusChip variant="success" label="Success" />
        <StatusChip variant="expired" label="Expired" />
      </div>
    </div>
  );
};

export default Test;

import StatusChip from "@/components/common/StatusChip";
import { Button } from "@/components/ui/button";
import { Building2, CloudUpload, StickyNoteCheck } from "lucide-react";

const fieldLabelClass = "text-[0.76rem] font-normal text-[#00000080]";

const PropertyField = ({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) => (
  <div className="pr-4" style={{ width: width }}>
    <p className={fieldLabelClass}>{label}</p>
    <p className="mt-0.5 truncate text-[0.83rem] font-normal text-font-color-primary p">
      {value}
    </p>
  </div>
);

const PropertyInfo = ({ property }) => {
  return (
    <div className="rounded-sm bg-white shadow-card">
      <div className="flex w-full min-w-0 items-center gap-4 px-4 py-3">
        <div
          aria-hidden
          className="size-14 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-100"
        >
          <div className="flex size-full items-center justify-center text-[#9ca3af]">
            <Building2 className="size-6" />
          </div>
        </div>

        <div className="flex  w-full">
          <PropertyField
            label="Project Name"
            value={property?.project_name}
            width={"17%"}
          />
          <PropertyField
            label="Property Name"
            value={property?.property_name}
            width={"17%"}
          />
          <PropertyField
            label="Property Id"
            value={property?.property_id}
            width={"13%"}
          />
          <PropertyField
            label="Lease Id"
            value={property?.lease_id}
            width={"13%"}
          />

          <div style={{ width: "12%" }}>
            <p className={fieldLabelClass}>Job status</p>
            <div className="mt-0.5">
              <StatusChip
                variant={"expired"}
                label={"Expired"}
                className="font-normal"
              />
            </div>
          </div>

          <div
            style={{
              width: "30%",
              overflow: "hidden",
            }}
          >
            {/* <div> */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                className="border-main-theme text-main-theme hover:bg-[#f0fdf4]"
                onClick={() => {}}
              >
                <CloudUpload aria-hidden />
                Upload Documents
              </Button>

              <Button size="sm" variant="primary" onClick={() => {}}>
                <StickyNoteCheck aria-hidden />
                View Docs HITL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;

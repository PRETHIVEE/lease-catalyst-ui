// import StatusChip from "@/components/common/StatusChip";
import StatusChip from "@/components/common/StatusChip";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  ChevronDownIcon,
  CloudUpload,
  // CloudUpload,
  // StickyNoteCheck,
  Download,
} from "lucide-react";

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

type PropertyInfoData = {
  project_name?: string;
  property_name?: string;
  property_id?: string;
  lease_id?: string;
};

const PropertyInfo = ({
  property,
  handleUploadClick,
  handleRequestDocsClick,
}: {
  property: PropertyInfoData | null;
  handleUploadClick: () => void;
  handleRequestDocsClick: () => void;
}) => {
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
            value={property?.project_name ?? ""}
            width={"17%"}
          />
          <PropertyField
            label="Property Name"
            value={property?.property_name ?? ""}
            width={"17%"}
          />
          <PropertyField
            label="Property Id"
            value={property?.property_id ?? ""}
            width={"13%"}
          />
          <PropertyField
            label="Lease Id"
            value={property?.lease_id ?? ""}
            width={"13%"}
          />

          <div
            style={{
              width: "40%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p className={fieldLabelClass}>Job status</p>
              <div className="mt-0.5">
                <StatusChip
                  variant={"expired"}
                  label={"Unknown"}
                  className="font-normal"
                />
              </div>
            </div>

            <ButtonGroup>
              <Button variant="primary" onClick={handleUploadClick}>
                <CloudUpload aria-hidden />
                Upload Documents
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="primary" className="pl-2!">
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-auto min-w-40 border border-slate-200 bg-white text-[#374151] shadow-none"
                >
                  <DropdownMenuGroup>
                    <DropdownMenuItem onSelect={handleRequestDocsClick}>
                      <Download />
                      Request Documents
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfo;

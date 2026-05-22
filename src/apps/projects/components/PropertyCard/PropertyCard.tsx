import IconButton from "@/components/common/IconButton";
import StatusChip from "@/components/common/StatusChip";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Building2, FileScan, FileText, Pencil, Play } from "lucide-react";

import PropertyDocumentsTable from "./PropertyDocumentsTable";
import type { PropertyItem } from "./types";

type PropertyCardProps = {
  property: PropertyItem;
};

const fieldLabelClass = "text-[0.76rem] font-normal text-[#00000070]";

const PropertyField = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 flex-1">
    <p className={fieldLabelClass}>{label}</p>
    <p className="mt-0.5 truncate text-[0.83rem] font-normal text-font-color-primary">
      {value}
    </p>
  </div>
);

const sampleDataDocs = [
  {
    id: "doc-1",
    fileName: "sample_test_2024.pdf",
    fileType: "PDF",
    lastUpdated: "2023-10-12",
  },
  {
    id: "doc-2",
    fileName: "sample test Certificate.pdf",
    fileType: "PDF",
    lastUpdated: "2023-09-28",
  },
];

const PropertyCard = ({ property }: any) => {
  const {
    id,
    property_name,
    property_id,
    lease_id,
    tenant_names,
    status = "unknown",
    documents = sampleDataDocs,
  } = property;

  return (
    <AccordionItem
      value={id}
      className="rounded-xl border border-slate-300 bg-white not-last:border-b"
    >
      <AccordionTrigger className="w-full items-center px-4 py-3 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:self-center [&_[data-slot=accordion-trigger-icon]]:text-[#6b7280]">
        <div className="flex w-full min-w-0 flex-1 items-center gap-4 pr-2">
          <div
            aria-hidden
            className="size-14 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-100"
          >
            <div className="flex size-full items-center justify-center text-[#9ca3af]">
              <Building2 className="size-6" />
            </div>
          </div>

          <div className="grid min-w-0 flex-1 grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-5">
            <PropertyField label="Property Name" value={property_name} />
            <PropertyField label="Property Id" value={property_id} />
            <PropertyField label="Lease Id" value={lease_id} />
            <PropertyField label="Tenant Name" value={tenant_names[0]} />
            <div className="shrink-0">
              <p className={fieldLabelClass}>Job status</p>
              <div className="mt-0.5">
                <StatusChip
                  variant={"expired"}
                  label={status}
                  className="font-normal"
                />
              </div>
            </div>
          </div>

          <IconButton
            aria-label={`Edit ${property_name}`}
            className="shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            <Pencil className="size-4" aria-hidden />
          </IconButton>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4 [&>div]:h-auto">
        <div className="flex justify-end gap-2 border-t border-slate-300 pt-3">
          <Button
            size="sm"
            variant="outline"
            className="border-main-theme text-main-theme hover:bg-[#f0fdf4]"
            onClick={() => {}}
          >
            <FileScan aria-hidden />
            View DQC
          </Button>
          <Button size="sm" variant="primary" onClick={() => {}}>
            <Play aria-hidden />
            Run Job
          </Button>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center gap-2 text-[0.84rem] font-semibold text-font-color-primary">
            <FileText className="size-4 text-main-theme" aria-hidden />
            Documents
          </div>
          <PropertyDocumentsTable documents={documents} />
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PropertyCard;

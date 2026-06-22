/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonGroup } from "@/components/ui/button-group";
import NoDataFound from "@/components/common/NoDataFound";
import { Skeleton } from "@/components/ui/skeleton";
import { fileDownloader, getPresignedUrl } from "@/utils/utils";

type LeaseAttribute = {
  attributeName: string;
  attributeDescription: string;
  attributeValue: any;
  isSelected: boolean;
  isNew: boolean;
};

type LeaseSubGroup = {
  subGroupName: string;
  isSelected: boolean;
  isNew: boolean;
  attributes: LeaseAttribute[];
};

type LeaseGroup = {
  groupName: string;
  isSelected: boolean;
  isNew: boolean;
  subGroups: LeaseSubGroup[];
};

const parseJson = (value: any) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  return value;
};

const isLeafAttributeField = (value: any) => {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "value" in value
  );
};

const isAttributeContainer = (value: any) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(isLeafAttributeField);
};

const formatAttributeValue = (value: any) => {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return "-";
    }
  }

  return String(value);
};

const toAttributes = (value: any): LeaseAttribute[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => toAttributes(item));
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  if (isAttributeContainer(value)) {
    return Object.entries(value).map(
      ([attributeName, field]: [string, any]) => ({
        attributeName,
        attributeDescription:
          field && typeof field.attributeDescription === "string"
            ? field.attributeDescription
            : "",
        attributeValue: formatAttributeValue(field?.value ?? "-"),
        isSelected: false,
        isNew: false,
      }),
    );
  }

  return Object.entries(value).flatMap(
    ([attributeName, field]: [string, any]) => {
      if (isLeafAttributeField(field)) {
        return [
          {
            attributeName,
            attributeDescription:
              field && typeof field.attributeDescription === "string"
                ? field.attributeDescription
                : "",
            attributeValue: formatAttributeValue(field?.value ?? "-"),
            isSelected: false,
            isNew: false,
          },
        ];
      }

      if (Array.isArray(field)) {
        return toAttributes(field);
      }

      return [];
    },
  );
};

const toSubGroups = (value: any, fallbackName: string): LeaseSubGroup[] => {
  if (!value && value !== 0) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item, index) => ({
      subGroupName:
        item && typeof item === "object" && "subGroupName" in item
          ? item.subGroupName
          : value.length > 1
            ? `${fallbackName} ${index + 1}`
            : fallbackName,
      isSelected: false,
      isNew: false,
      attributes: toAttributes(item),
    }));
  }

  if (typeof value === "object") {
    if (isAttributeContainer(value)) {
      return [
        {
          subGroupName: fallbackName,
          isSelected: false,
          isNew: false,
          attributes: toAttributes(value),
        },
      ];
    }

    return Object.entries(value).map(([subGroupName, subGroupValue]) => ({
      subGroupName,
      isSelected: false,
      isNew: false,
      attributes: toAttributes(subGroupValue),
    }));
  }

  return [];
};

const normalizeLeaseAbstractionData = (data: any): LeaseGroup[] => {
  const parsed = parseJson(data);
  const root = parsed?.Lease_Abstraction ?? parsed;

  if (!root || (typeof root !== "object" && !Array.isArray(root))) {
    return [];
  }

  if (Array.isArray(root)) {
    return root.map((entry, index) => ({
      groupName:
        entry && typeof entry === "object" && "groupName" in entry
          ? entry.groupName
          : `Group ${index + 1}`,
      isSelected: false,
      isNew: false,
      subGroups:
        entry && typeof entry === "object" && Array.isArray(entry.subGroups)
          ? entry.subGroups
          : toSubGroups(entry, `Group ${index + 1}`),
    }));
  }

  return Object.entries(root).map(([groupName, groupValue]) => ({
    groupName,
    isSelected: false,
    isNew: false,
    subGroups: toSubGroups(groupValue, groupName),
  }));
};

const LeaseAbstraction = ({
  abstractionStatus,
  isLoading,
  abstractionData,
}: {
  propertyName: any;
  abstractionStatus: string;
  isLoading: boolean;
  abstractionData: any;
}) => {
  if (isLoading) {
    return (
      <div className="mt-10 w-[70%] m-auto">
        <Skeleton className="h-[8rem] mb-5 bg-[#e8f4e5] w-full" />
        <Skeleton className="h-[8rem] bg-[#e8f4e5] w-full" />
      </div>
    );
  }

  if (abstractionStatus !== "Abstraction Completed") {
    return (
      <div className="mt-10">
        <NoDataFound message="Lease Abstraction is not Completed for this Property" />
      </div>
    );
  }

  const abstractionJsonData = parseJson(abstractionData?.abstraction_json_data);
  const leaseAbstractionData =
    normalizeLeaseAbstractionData(abstractionJsonData);
  const displayData = leaseAbstractionData.length ? leaseAbstractionData : [];

  const handleDownload = (type: string = "CSV") => {
    const data = JSON.parse(abstractionData?.abstraction_output);

    if (data) {
      const filePath = type === "CSV" ? data?.csv_s3_key : data?.rhs_filename;
      if (type === "CSV") {
        getPresignedUrl(filePath).then((url) => {
          fileDownloader(url);
        });
      } else if (type === "JSON") {
        getPresignedUrl(filePath).then((url) => {
          const filename = filePath.split("/").pop() || "download.json";
          JsonDownloader(url, filename);
        });
      }
    }
  };

  const JsonDownloader = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("File download failed:", error);
      window.open(url, "_blank");
    }
  };

  return (
    <div className="mt-1.2">
      <div className="flex justify-end items-center gap-3 mt-2">
        <Button variant="outline" size="sm" disabled>
          <Edit /> Edit Lease
        </Button>

        <ButtonGroup>
          <Button variant="primary">Export</Button>
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
                <DropdownMenuItem onSelect={() => handleDownload("CSV")}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => handleDownload("JSON")}>
                  Download as JSON
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </div>

      <div className="mx-auto mt-4 max-w-[1000px] space-y-4">
        {displayData.map((group) => (
          <section
            key={group.groupName}
            className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-300 bg-slate-100 px-4 py-2">
              <h2 className="text-[0.88rem] font-bold uppercase text-slate-700">
                {group.groupName}
              </h2>
            </div>

            <div className="space-y-6 p-4">
              {group.subGroups.map((subGroup) => (
                <div key={subGroup.subGroupName} className="space-y-3">
                  <div className="rounded-md bg-[#f0fdf4] px-3 py-2 text-sm font-semibold text-slate-800">
                    {subGroup.subGroupName}
                  </div>
                  <div className="overflow-hidden rounded-sm border border-slate-200">
                    <table className="min-w-full border-collapse text-left text-sm">
                      <tbody className="divide-y divide-slate-200">
                        {subGroup.attributes.map((attribute, index) => (
                          <tr
                            key={`${attribute.attributeName}-${index}`}
                            className="bg-white hover:bg-gray-100 transition-colors text-[0.8rem]"
                          >
                            <td className="w-1/3 whitespace-nowrap px-4 py-1.5 font-medium text-slate-900">
                              {attribute.attributeName}
                            </td>
                            <td className="px-4 py-1.5 text-gray-500">
                              {attribute.attributeValue ?? "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default LeaseAbstraction;

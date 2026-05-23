import PropertyInfo from "./components/PropertyInfo";
import EvaluationTable from "./components/EvaluationTable";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import { useSearchParams } from "react-router-dom";
import DashboardAPI from "@/api/dashboard";
import { useEffect, useState } from "react";
import NoDataFound from "@/components/common/NoDataFound";

const BreadcrumbsData = [
  { label: "Dashboard", url: "/dashboard" },
  { label: "Document QC", url: "/dashboard/document-qc" },
];

function transformData(inputData) {
  return Object.entries(inputData).map(([key, value], index) => ({
    id: index + 1,
    evaluationPoint: key,
    dataCaptured: value["answer"],
    supportingEvidence: value["supporting evidence"],
    confidentScore: value["confidence score"],
    notes: value["notes"],
  }));
}

const DocumentQC = () => {
  const [searchParams] = useSearchParams();
  const JobId = searchParams.get("jobId") || "";

  const [loading, setLoading] = useState(false);
  const [dqcData, setDqcData] = useState<any[]>([]);
  const [propertyInfo, setPropertyInfo] = useState<any>(null);

  useEffect(() => {
    if (JobId) {
      setLoading(true);
      DashboardAPI.getDqcResult(JobId)
        .then((response) => {
          if (response.status === 200) {
            const transformedData = transformData(response.data.DQC || {});
            setDqcData(transformedData);
            setPropertyInfo({
              attribute_category: response.data.attribute_category,
              job_id: response.data.job_id,
              lease_id: response.data.lease_id,
              project_id: response.data.project_id,
              project_name: response.data.project_name,
              property_id: response.data.property_id,
              property_name: response.data.property_name,
            });
          } else {
            setDqcData([]);
          }
        })
        .catch(() => {
          setDqcData([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [JobId]);

  console.log("dqcData:", dqcData);
  console.log("dqcData propertyInfo:", propertyInfo);

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
      <div className="mt-2">
        <PropertyInfo property={propertyInfo} />
        <EvaluationTable data={dqcData} isLoading={loading} />
      </div>
    </div>
  );
};

export default DocumentQC;

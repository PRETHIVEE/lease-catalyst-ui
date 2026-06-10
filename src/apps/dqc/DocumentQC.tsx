/* eslint-disable @typescript-eslint/no-explicit-any */
import PropertyInfo from "./components/PropertyInfo";
import EvaluationTable from "./components/EvaluationTable";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import { useSearchParams } from "react-router-dom";
import DashboardAPI from "@/api/dashboard";
import { useEffect, useState } from "react";
import UploadFiles from "../projects/components/UploadFiles/UploadFiles";
import RequestDocuments from "./components/RequestDocuments/RequestDocuments";
const BreadcrumbsData = [
  { label: "Dashboard", url: "/dashboard" },
  { label: "Document QC", url: "/dashboard/document-qc" },
];

type DqcEntry = {
  answer: string;
  "supporting evidence": string;
  "confidence score": string | number;
  notes: string;
};

function transformData(inputData: Record<string, DqcEntry>) {
  return Object.entries(inputData).map(([key, value], index) => ({
    id: index + 1,
    evaluationPoint: key,
    dataCaptured: value.answer,
    supportingEvidence: value["supporting evidence"],
    confidentScore: value["confidence score"],
    notes: value.notes,
  }));
}

const DocumentQC = () => {
  const [searchParams] = useSearchParams();
  const JobId = searchParams.get("jobId") || "";
  const [loading, setLoading] = useState(true);
  const [dqcData, setDqcData] = useState<any[]>([]);
  const [propertyInfo, setPropertyInfo] = useState<any>(null);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadDocuments, setUploadDocuments] = useState<File[]>([]);
  const [isOpenRequestDocs, setIsRequestingDocs] = useState(false);

  console.log("dqcData:", dqcData);
  console.log("dqcData propertyInfo:", propertyInfo);

  useEffect(() => {
    if (JobId) {
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

  const handleUploadClose = () => {
    setIsOpenUpload(false);
    setUploadDocuments([]);
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      handleUploadClose();
    }, 2000);
  };
  // Implement the logic to upload documents here

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
      <div className="mt-2">
        <PropertyInfo
          property={propertyInfo}
          handleUploadClick={() => setIsOpenUpload(true)}
          handleRequestDocsClick={() => setIsRequestingDocs(true)}
        />
        <EvaluationTable data={dqcData} isLoading={loading} />
      </div>

      {/* POP UPS */}
      <>
        <UploadFiles
          open={isOpenUpload}
          onClose={() => {
            handleUploadClose();
          }}
          isSubmitting={isUploading}
          propertyName={propertyInfo?.property_name || ""}
          uploadDocuments={uploadDocuments}
          setUploadDocuments={setUploadDocuments}
          handleUpload={handleUpload}
        />

        <RequestDocuments
          open={isOpenRequestDocs}
          onClose={() => setIsRequestingDocs(false)}
          isSubmitting={false}
          propertyName={propertyInfo?.property_name || ""}
        />
      </>
    </div>
  );
};

export default DocumentQC;

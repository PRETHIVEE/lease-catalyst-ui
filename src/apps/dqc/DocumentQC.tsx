/* eslint-disable @typescript-eslint/no-explicit-any */
import PropertyInfo from "./components/PropertyInfo";
import EvaluationTable from "./components/EvaluationTable";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import { useNavigate, useSearchParams } from "react-router-dom";
import DashboardAPI from "@/api/dashboard";
import { useEffect, useState } from "react";
import UploadFiles from "../projects/components/UploadFiles/UploadFiles";
import RequestDocuments from "./components/RequestDocuments/RequestDocuments";
import ProjectsAPI from "@/api/projects";
import { useSnackbarStore } from "@/store/snackbar-store";
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
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const [searchParams] = useSearchParams();
  const JobId = searchParams.get("jobId") || "";
  const [loading, setLoading] = useState(true);
  const [dqcData, setDqcData] = useState<any[]>([]);
  const [propertyInfo, setPropertyInfo] = useState<any>(null);
  const [isOpenUpload, setIsOpenUpload] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isTriggeringJob, setIsTriggeringJob] = useState(false);
  const [uploadDocuments, setUploadDocuments] = useState<File[]>([]);
  const [isOpenRequestDocs, setIsRequestingDocs] = useState(false);
  const [legalDocsList, setLegalDocsList] = useState<string[]>([]);

  useEffect(() => {
    if (JobId) {
      DashboardAPI.getDqcResult(JobId)
        .then((response) => {
          if (response.status === 200) {
            const legalDocs =
              response?.data?.full_dqc_data?.Legal_Doc_List || [];
            setLegalDocsList(legalDocs);
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

  const handleRunJob = () => {
    setIsTriggeringJob(true);
    const payload = {
      property_id: Number(propertyInfo?.property_id),
    };
    ProjectsAPI.triggerDQCWorkflow(payload)
      .then((response) => {
        if (response?.status === 200) {
          showSnackbar(response?.data?.message);
          navigate("/dashboard");
        }
      })
      .catch(() => {
        showSnackbar("Error running the job", "error");
      })
      .finally(() => {
        setIsTriggeringJob(false);
        handleUploadClose();
      });
  };

  const handleUpload = () => {
    if (uploadDocuments.length === 0) return;

    const formData = new FormData();
    uploadDocuments.forEach((file) => {
      formData.append("files", file);
    });

    setIsUploading(true);
    ProjectsAPI.uploadPropertyFiles(Number(propertyInfo?.property_id), formData)
      .then(() => {
        showSnackbar("Files Uploaded! ");
        handleRunJob();
      })
      .catch(() => {
        showSnackbar("error uploading files.", "error");
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleCompleteDQC = () => {
    const askConfirmation = window.confirm(
      "Are you sure you want to mark this DQC as complete?",
    );

    if (askConfirmation) {
      ProjectsAPI?.triggerAbstractionWorkflow({
        property_id: propertyInfo?.property_id,
        legal_docs_list: legalDocsList,
      })
        .then((r) => {
          console.log("DQC marked as complete:", r);
          navigate("/dashboard");
        })
        .catch((e) => {
          console.error("Error marking DQC as complete:", e);
        });
    }
  };

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
      <div className="mt-2">
        <PropertyInfo
          property={propertyInfo}
          handleUploadClick={() => setIsOpenUpload(true)}
          handleRequestDocsClick={() => setIsRequestingDocs(true)}
          handleCompleteDQC={handleCompleteDQC}
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
          isSubmitting={isUploading || isTriggeringJob}
          propertyName={propertyInfo?.property_name || ""}
          uploadDocuments={uploadDocuments}
          setUploadDocuments={setUploadDocuments}
          handleUpload={handleUpload}
          componentLocation="DQC"
          isTriggeringJob={isTriggeringJob}
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

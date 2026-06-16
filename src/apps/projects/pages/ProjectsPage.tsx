/* eslint-disable @typescript-eslint/no-explicit-any */
import ProjectsAPI from "@/api/projects";
import NoDataFound from "@/components/common/NoDataFound";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/utils/utils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CreateProject from "../components/CreateProject/CreateProject";
import { useFormik } from "formik";
import * as Yup from "yup";
import DashboardAPI from "@/api/dashboard";
import { useSnackbarStore } from "@/store/snackbar-store";
import ProjectWidget from "../components/ProjectWidget/ProjectWidget";

interface DataCategory {
  attribute: string;
  description: string;
  status: string;
}

const ProjectsPage = () => {
  const [Rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("user_id") || "";
  const userEmail = localStorage.getItem("user_email") || "";
  const [openCreateProject, setOpenCreateProject] = useState(false);
  const [dataCategoryList, setDataCategoryList] = useState<DataCategory[]>([]);
  const { showSnackbar } = useSnackbarStore();

  const validationSchema = Yup.object({
    projectName: Yup.string().required("Project Name is required"),
    template: Yup.object().required("Data Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      projectName: "",
      template: null,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onCreateProject(values);
    },
  });

  const handleCloseProjectModal = () => {
    setOpenCreateProject(false);
    formik.resetForm();
  };

  const getDataCategoryList = () => {
    DashboardAPI.getAttributeCategories()
      .then(({ status, data }) => {
        if (status !== 200) throw new Error();

        const merged = [
          ...(Array.isArray(data?.custom) ? data.custom : []),
          ...(Array.isArray(data?.default) ? data.default : []),
        ];

        setDataCategoryList(
          merged.map(({ attribute, description, status = "" }) => ({
            attribute,
            description,
            status,
          })),
        );
      })
      .catch(() => setDataCategoryList([]));
  };

  const getProjectList = () => {
    ProjectsAPI.getProjects(Number(userId))
      .then((response) => {
        if (response.status === 200) {
          setRows(response.data);
        } else {
          setRows([]);
        }
      })
      .catch(() => {
        setRows([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const deleteProject = (projectId: number) => {
    ProjectsAPI.deleteProject(projectId)
      .then(() => {
        showSnackbar("Project deleted", "success");
        getProjectList();
      })
      .catch(() => {
        showSnackbar("Failed to delete project. Please try again.", "error");
      });
  };

  useEffect(() => {
    if (userId) {
      getProjectList();
      getDataCategoryList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const onCreateProject = (data: any) => {
    setIsSubmitting(true);
    const requestBody = {
      project_name: data.projectName,
      category: data.template?.attribute,
      property_count: 0,
      user_id: Number(userId),
      user_name: userEmail,
    };

    ProjectsAPI.CreateProject(requestBody)
      .then((response) => {
        if (response.status === 201) {
          getProjectList();
          showSnackbar("Project created!");
        }
      })
      .catch(() => {
        showSnackbar("Failed to create project.", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
        handleCloseProjectModal();
      });
  };

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between">
        <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
          Projects
        </h5>
        <Button
          className="mt-1"
          size="sm"
          variant="primary"
          onClick={() => setOpenCreateProject(true)}
        >
          <Plus strokeWidth={3} /> Create Project
        </Button>
      </div>

      {loading ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          <Skeleton className="h-[11rem] bg-[#e8f4e5] w-full" />
          <Skeleton className="h-[11rem] bg-[#e8f4e5] w-full" />
          <Skeleton className="h-[11rem] bg-[#e8f4e5] w-full" />
        </div>
      ) : Rows.length > 0 ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {Rows.map((row) => (
            <ProjectWidget
              key={row.id}
              projectId={row.id}
              companyName={row.project_name}
              dataCategory={row.category}
              propertiesCount={row.property_count ?? 0}
              date={formatDateTime(row.last_created)}
              onDelete={deleteProject}
            />
          ))}
        </div>
      ) : (
        <div className="mt-4">
          <NoDataFound message="No projects found. Create your first project!" />
        </div>
      )}

      <CreateProject
        open={openCreateProject}
        onClose={handleCloseProjectModal}
        formik={formik}
        dataCategoryOptions={dataCategoryList}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProjectsPage;

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import BreadCrumbs from "@/components/common/BreadCrumbs";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Building2, Grid3x3, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PropertyCard from "../../components/PropertyCard/PropertyCard";
import { Button } from "@/components/ui/button";
import ProjectsAPI from "@/api/projects";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import CreateProperty from "../../components/CreateProperty/CreateProperty";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSnackbarStore } from "@/store/snackbar-store";
import { formatDateTime } from "@/utils/utils";
import NoDataFound from "@/components/common/NoDataFound";

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
  { label: "Projects", url: "/projects" },
  { label: "Projects Details", url: "/" },
];

const ProjectDetails = () => {
  const [searchParams] = useSearchParams();
  const { showSnackbar } = useSnackbarStore();
  const projectId = searchParams.get("id");
  const [projectDetails, setProjectDetails] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("properties");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertiesData, setPropertiesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openCreateProperty, setOpenCreateProperty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userEmail = localStorage.getItem("user_email") || "";
  const userId = localStorage.getItem("user_id") || "";

  const validationSchema = Yup.object({
    projectName: Yup.string().required("Project Name is required"),
    propertyName: Yup.string().required("Property Name is required"),
    propertyId: Yup.string().required("Property ID is required"),
    leaseId: Yup.string().required("Lease ID is required"),
    tenantName: Yup.string().required("Tenant Name is required"),
  });

  const formik = useFormik({
    initialValues: {
      projectName: "",
      propertyName: "",
      propertyId: "",
      leaseId: "",
      tenantName: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      onCreateProperty(values);
    },
  });

  const handleClosePropertyModal = () => {
    setOpenCreateProperty(false);
    formik.resetForm();
  };

  const onCreateProperty = (data: any) => {
    setIsSubmitting(true);
    const requestBody = [
      {
        project_id: projectId,
        property_id: data.propertyId,
        property_name: data.propertyName,
        lease_id: data.leaseId,
        tenant_names: [data.tenantName],
        user_id: Number(userId),
        user_name: userEmail,
      },
    ];
    ProjectsAPI.CreateProperty(requestBody)
      .then((response) => {
        if (response.status === 201) {
          getProperties();
          showSnackbar("Project created!");
          handleClosePropertyModal();
        } else {
          showSnackbar("Failed to create project.", "error");
        }
      })
      .catch((error) => {
        console.log("Failed to create property", error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const getProperties = () => {
    ProjectsAPI.getPropertyList(Number(projectId))
      .then((response) => {
        if (response.statusText === "OK") {
          const data = response.data || [];
          setPropertiesData(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getProjectDetails = () => {
    ProjectsAPI.getProjectById(Number(projectId))
      .then((response) => {
        setProjectDetails(response?.data);
      })
      .catch(() => {
        // Handle error
      });
  };

  useEffect(() => {
    getProjectDetails();
    getProperties();
  }, []);

  const handleCreate = () => {
    setOpenCreateProperty(true);
    formik.setFieldValue("projectName", projectDetails?.project_name || "");
  };

  const filteredProperties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return propertiesData;

    return propertiesData.filter((property) => {
      const propertyName = property.property_name?.toLowerCase() ?? "";
      const propertyId = property.property_id?.toLowerCase() ?? "";
      const leaseId = property.lease_id?.toLowerCase() ?? "";
      const tenantMatch = (property.tenant_names ?? []).some((name: string) =>
        name.toLowerCase().includes(query)
      );

      return (
        propertyName.includes(query) ||
        propertyId.includes(query) ||
        leaseId.includes(query) ||
        tenantMatch
      );
    });
  }, [searchQuery, propertiesData]);

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />

      <div>
        <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
          Project Details
        </h5>

        <div className="mt-1.5">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="gap-0"
          >
            <TabsList>
              <TabsTrigger value="project">
                <Building2 aria-hidden />
                Project
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Building aria-hidden />
                Properties
              </TabsTrigger>
              <TabsTrigger value="attributes">
                <Grid3x3 aria-hidden />
                Atrributes
              </TabsTrigger>
            </TabsList>

            {activeTab === "project" && (
              <div className="mt-4 bg-white p-4 rounded-sm shadow-card text-[0.85rem]">
                <p className="">
                  <span className="font-medium inline-block min-w-[7rem]">
                    Project Name{" "}
                  </span>{" "}
                  : {projectDetails?.project_name || "N/A"}
                </p>
                <p className="mt-2">
                  <span className="font-medium inline-block min-w-[7rem]">
                    Data Category{" "}
                  </span>{" "}
                  : {projectDetails?.category || "N/A"}
                </p>
                <p className="mt-2">
                  <span className="font-medium inline-block min-w-[7rem]">
                    No of Properties{" "}
                  </span>{" "}
                  : {projectDetails?.property_count || "N/A"}
                </p>
                <p className="mt-2">
                  <span className="font-medium inline-block min-w-[7rem]">
                    Created On{" "}
                  </span>{" "}
                  : {formatDateTime(projectDetails?.last_created) || "N/A"}
                </p>
              </div>
            )}

            {activeTab === "properties" && (
              <div className="mt-2">
                <div className="flex justify-end items-center gap-2">
                  <div className="relative w-full max-w-xs">
                    <Search
                      className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                      aria-hidden
                    />
                    <Input
                      type="search"
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="h-8 pl-8 text-xs"
                      aria-label="Search properties"
                    />
                  </div>

                  <Button variant="primary" onClick={() => handleCreate()}>
                    <Plus strokeWidth={2} /> Add Property
                  </Button>
                </div>

                {isLoading ? (
                  <div>
                    <Skeleton className="h-[5.5rem] bg-[#e8f4e5] w-full my-4" />
                    <Skeleton className="h-[5.5rem] bg-[#e8f4e5] w-full my-4" />
                  </div>
                ) : (
                  <Accordion
                    type="multiple"
                    defaultValue={[propertiesData[0]?.id]}
                    className="mt-3 gap-3"
                  >
                    {filteredProperties.length > 0 ? (
                      filteredProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))
                    ) : searchQuery?.length > 0 ? (
                      <NoDataFound message="No properties match your search." />
                    ) : (
                      <NoDataFound message="No properties available." />
                    )}
                  </Accordion>
                )}
              </div>
            )}
          </Tabs>
        </div>
      </div>

      <CreateProperty
        open={openCreateProperty}
        onClose={handleClosePropertyModal}
        formik={formik}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default ProjectDetails;

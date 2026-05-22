import BreadCrumbs from "@/components/common/BreadCrumbs";
import { Accordion } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Building2, Grid3x3, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PropertyCard from "../../components/PropertyCard/PropertyCard";
// import { propertiesData } from "./propertiesData";
import { Button } from "@/components/ui/button";
import ProjectsAPI from "@/api/projects";
import { useSearchParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const BreadcrumbsData = [
  { label: "Home", url: "/home" },
  { label: "Projects", url: "/projects" },
  { label: "Projects Details", url: "/" },
];

const ProjectDetails = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const [activeTab, setActiveTab] = useState("properties");
  const [searchQuery, setSearchQuery] = useState("");
  const [propertiesData, setPropertiesData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProperties = () => {
    setIsLoading(true);
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
  useEffect(() => {
    getProperties();
  }, []);

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
                  <Button variant="primary">
                    <Plus strokeWidth={2} /> Add Property
                  </Button>
                </div>

                {isLoading && (
                  <div>
                    <Skeleton className="h-[5.5rem] bg-[#e8f4e5] w-full my-4" />
                    <Skeleton className="h-[5.5rem] bg-[#e8f4e5] w-full my-4" />
                  </div>
                )}

                <Accordion
                  type="multiple"
                  defaultValue={[propertiesData[0]?.id]}
                  className="mt-3 gap-3"
                >
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))
                  ) : (
                    <p className="py-8 text-center text-sm text-muted-foreground">
                      No properties match your search.
                    </p>
                  )}
                </Accordion>
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

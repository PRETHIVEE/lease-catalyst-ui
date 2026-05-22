import BreadCrumbs from "@/components/common/BreadCrumbs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Building2, Grid3x3 } from "lucide-react";
import { useState } from "react";
import PropertyCard from "../../components/PropertyCard/PropertyCard";

const BreadcrumbsData = [
  { label: "Home", url: "/home" },
  { label: "Projects", url: "/projects" },
  { label: "Projects Details", url: "/" },
];

const ProjectDetails = () => {
  const [activeTab, setActiveTab] = useState("properties");

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

            {/* <div className="mt-4">
              <h6>Details about Project</h6>
            </div> */}

            <PropertyCard />
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

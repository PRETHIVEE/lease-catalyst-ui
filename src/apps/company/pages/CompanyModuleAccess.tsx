import BreadCrumbs from "@/components/common/BreadCrumbs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Blocks,
  Building2,
  Calendar,
  FolderOpen,
  Grid,
  Grid2X2,
  Languages,
  Save,
  ShieldUser,
  X,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Checkbox } from "@mui/material";
import { Button } from "@/components/ui/button";

const BreadcrumbsData = [
  { label: "Company", url: "/company" },
  {
    label: `Company details (${" "})`,
    url: "/",
  },
];

const Modules = [
  {
    id: 1,
    name: "Job Dashboard",
    description: "",
    isEnabled: true,
    icon: Grid2X2,
  },
  {
    id: 2,
    name: "Data Category",
    description: "",
    isEnabled: true,
    icon: FolderOpen,
  },
  {
    id: 3,
    name: "Projects",
    description: "",
    isEnabled: true,
    icon: FolderOpen,
  },
  {
    id: 4,
    name: "Events",
    description: "",
    isEnabled: true,
    icon: Calendar,
  },
  {
    id: 5,
    name: "Reporting Dashboard",
    description: "",
    isEnabled: true,
    icon: Grid,
  },
  {
    id: 6,
    name: "Translate",
    description: "",
    isEnabled: true,
    icon: Languages,
  },
  {
    id: 7,
    name: "App Integrations",
    description: "",
    isEnabled: true,
    icon: Blocks,
  },
];

const CompanyModuleAccess = () => {
  const location = useLocation();
  const defaultTab = location?.state?.tab || "project-details";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [ModulesList, setModulesList] = useState(Modules);

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />

      <div className="mt-1.5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <div className="flex justify-between items-center gap-16">
            <TabsList>
              <TabsTrigger value="project-details">
                <Building2 aria-hidden />
                Project Details
              </TabsTrigger>

              <TabsTrigger value="module-access">
                <ShieldUser aria-hidden />
                Module Access Control
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {activeTab === "project-details" && (
          <div className="mt-4 bg-white p-4 rounded-sm shadow-card text-[0.85rem]">
            <h6 className="font-medium mb-2">Project details content</h6>
          </div>
        )}

        {activeTab === "module-access" && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ModulesList.map((module) => {
                const IconComponent = module.icon;
                return (
                  <div
                    key={module.id}
                    className="bg-white p-2 rounded-sm shadow-card cursor-pointer"
                    onClick={() => {
                      setModulesList((prev) =>
                        prev.map((m) =>
                          m.id === module.id
                            ? { ...m, isEnabled: !m.isEnabled }
                            : m,
                        ),
                      );
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        color="success"
                        checked={module.isEnabled}
                        onChange={() => {
                          setModulesList((prev) =>
                            prev.map((m) =>
                              m.id === module.id
                                ? { ...m, isEnabled: !m.isEnabled }
                                : m,
                            ),
                          );
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <IconComponent size={20} className="text-gray-600" />
                      <div className="flex-1">
                        <h3 className="font-normal text-[0.85rem]">
                          {module.name}
                        </h3>
                        {module.description && (
                          <p className="text-xs text-gray-600">
                            {module.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" className="mt-4" onClick={() => {}}>
                <X aria-hidden className="mr-1.5" />
                Cancel
              </Button>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => alert("Saved!")}
              >
                <Save aria-hidden className="mr-1.5" />
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyModuleAccess;

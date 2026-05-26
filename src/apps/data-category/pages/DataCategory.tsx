import { useEffect, useState } from "react";
import { Grid2x2, Grid2x2Plus, LayoutGrid } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataCategoryCard from "../components/DataCategoryCard";
import DataCategoryAPI from "@/api/data-category";
import { Skeleton } from "@/components/ui/skeleton";

const DataCategory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const userEmail = localStorage.getItem("user_email") || "";
  const [loading, setLoading] = useState(true);
  const [builtInDataCat, setBuitInDataCat] = useState<any[]>([]);
  const [customDataCat, setCustomDataCat] = useState<any[]>([]);
  const Data =
    activeTab === "all"
      ? [...builtInDataCat, ...customDataCat]
      : activeTab === "built-in"
      ? builtInDataCat
      : customDataCat;

  const getAttributesTypes = () => {
    setLoading(true);
    DataCategoryAPI.getDataCategoryList(userEmail)
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
          setBuitInDataCat(data?.default);
          setCustomDataCat(data?.custom);
        } else {
          setBuitInDataCat([]);
          setCustomDataCat([]);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getAttributesTypes();
  }, []);

  return (
    <div className="p-4">
      <h5 className="text-[0.98rem] font-semibold text-font-color-primary">
        Data Category
      </h5>

      <div className="mt-1.5">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
          <TabsList>
            <TabsTrigger value="all">
              <LayoutGrid aria-hidden />
              All
            </TabsTrigger>
            <TabsTrigger value="built-in">
              <Grid2x2 aria-hidden />
              Built-in Category
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Grid2x2Plus aria-hidden />
              Custom Category
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              <Skeleton className="h-[10.5rem] bg-[#e8f4e5] w-full" />
              <Skeleton className="h-[10.5rem] bg-[#e8f4e5] w-full" />
              <Skeleton className="h-[10.5rem] bg-[#e8f4e5] w-full" />
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {Data?.map((i, idx) => (
                <DataCategoryCard
                  key={idx}
                  title={i?.attribute}
                  description={i?.description}
                  isCustomCatgory={Boolean(i?.status)}
                  status={i?.status}
                />
              ))}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default DataCategory;

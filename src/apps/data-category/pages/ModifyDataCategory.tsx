/* eslint-disable @typescript-eslint/no-explicit-any */
import DataCategoryAPI from "@/api/data-category";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import AddDrawer, { type AddDrawerPayload } from "../components/AddDrawer";
import SaveDrawer, { type SaveDrawerPayload } from "../components/SaveDrawer";
import { cn } from "@/lib/utils";
import { Pencil, Plus, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { transformAttributes } from "../components/datatransfomer";
import { Button } from "@/components/ui/button";
import TextField from "@mui/material/TextField";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSnackbarStore } from "@/store/snackbar-store";

const BreadcrumbsData = [
  { label: "Data Category", url: "/data-category" },
  { label: "Modify Data Category", url: "/" },
];

type CategoryAttribute = {
  attributeName: string;
  attributeDescription: string;
  isSelected: boolean;
  isNew: boolean;
};

type CategorySubGroup = {
  subGroupName: string;
  isSelected: boolean;
  isNew: boolean;
  attributes: CategoryAttribute[];
};

type CategoryGroup = {
  groupName: string;
  isSelected: boolean;
  isNew: boolean;
  subGroups: CategorySubGroup[];
};

type DrawerMode = "group" | "subgroup" | "attribute" | null;

type RawCategoryItem = {
  groupName: string;
  isSelected: string | boolean;
  isNew: boolean;
  subGroups: {
    subGroupName: string;
    isSelected: string | boolean;
    isNew: boolean;
    attributes: {
      attributeName: string;
      attributeDescription: string;
      isSelected: string | boolean;
      isNew: boolean;
    }[];
  }[];
};

const parseSelected = (value: string | boolean) =>
  value === true || value === "true";

const normalizeCategoryData = (data: RawCategoryItem[]): CategoryGroup[] =>
  data.map((group) => ({
    groupName: group.groupName,
    isSelected: parseSelected(group.isSelected),
    isNew: group.isNew,
    subGroups: group.subGroups.map((subGroup) => ({
      subGroupName: subGroup.subGroupName,
      isSelected: parseSelected(subGroup.isSelected),
      isNew: subGroup.isNew,
      attributes: subGroup.attributes.map((attribute) => ({
        attributeName: attribute.attributeName,
        attributeDescription: attribute.attributeDescription,
        isSelected: parseSelected(attribute.isSelected),
        isNew: attribute.isNew,
      })),
    })),
  }));

const GreenCheckbox = ({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel: string;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={inputRef}
      type="checkbox"
      checked={checked}
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.target.checked)}
      className="size-4 shrink-0 cursor-pointer rounded accent-main-theme"
    />
  );
};

const AddAction = ({
  label,
  onClick,
  className,
}: {
  label: string;
  onClick: () => void;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "mt-3 inline-flex items-center gap-1.5 text-[0.82rem] font-medium text-main-theme transition-colors hover:text-main-theme/80",
      className,
    )}
  >
    <Plus className="size-3.5" aria-hidden />
    {label}
  </button>
);

const EditableName = ({
  value,
  isNew,
  onChange,
  className,
}: {
  value: string;
  isNew: boolean;
  onChange: (value: string) => void;
  className?: string;
}) => {
  // Inline editing is intentionally disabled.
  // Names are edited/created via the Drawer flow instead.
  void isNew;
  void onChange;
  return (
    <span className={cn("text-font-color-primary", className)}>{value}</span>
  );
};

const getGroupSelectionState = (group: CategoryGroup) => {
  const allItems = group.subGroups.flatMap((subGroup) => subGroup.attributes);
  const selectedCount = allItems.filter((item) => item.isSelected).length;

  return {
    checked: selectedCount > 0 && selectedCount === allItems.length,
    indeterminate: selectedCount > 0 && selectedCount < allItems.length,
  };
};

const getSubGroupSelectionState = (subGroup: CategorySubGroup) => {
  const selectedCount = subGroup.attributes.filter(
    (item) => item.isSelected,
  ).length;

  return {
    checked: selectedCount > 0 && selectedCount === subGroup.attributes.length,
    indeterminate:
      selectedCount > 0 && selectedCount < subGroup.attributes.length,
  };
};

const ModifyDataCategory = () => {
  const [searchParams] = useSearchParams();
  const Mode = searchParams.get("mode");
  const DataCategory = searchParams.get("dc");
  const isModifyMode = Mode === "modify";
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryGroup[]>(() =>
    normalizeCategoryData([]),
  );
  const { showSnackbar } = useSnackbarStore();
  const [dataCategory, setDataCategory] = useState<any>(null);
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [drawerGroupIndex, setDrawerGroupIndex] = useState<number | null>(null);
  const [drawerSubGroupIndex, setDrawerSubGroupIndex] = useState<number | null>(
    null,
  );
  const [isSaveDrawerOpen, setIsSaveDrawerOpen] = useState(false);
  const [newDataCategoryName, setNewDataCategoryName] = useState(
    `${DataCategory} - Modified`,
  );

  console.log("categories:", categories);

  useEffect(() => {
    if (!DataCategory) return;

    DataCategoryAPI.getDataCategory(DataCategory).then((response) => {
      if (response.status === 200) {
        const category = response.data[0];
        setDataCategory(category);
        const transformedData = transformAttributes(category?.attributes);
        if (transformedData.length > 0) {
          setCategories(normalizeCategoryData(transformedData));
        }
      }
    });
  }, [DataCategory]);

  const updateGroup = (
    groupIndex: number,
    updater: (group: CategoryGroup) => CategoryGroup,
  ) => {
    setCategories((prev) =>
      prev.map((group, index) =>
        index === groupIndex ? updater(group) : group,
      ),
    );
  };

  const toggleGroup = (groupIndex: number, checked: boolean) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      isSelected: checked,
      subGroups: group.subGroups.map((subGroup) => ({
        ...subGroup,
        isSelected: checked,
        attributes: subGroup.attributes.map((attribute) => ({
          ...attribute,
          isSelected: checked,
        })),
      })),
    }));
  };

  const toggleSubGroup = (
    groupIndex: number,
    subGroupIndex: number,
    checked: boolean,
  ) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      subGroups: group.subGroups.map((subGroup, index) =>
        index === subGroupIndex
          ? {
              ...subGroup,
              isSelected: checked,
              attributes: subGroup.attributes.map((attribute) => ({
                ...attribute,
                isSelected: checked,
              })),
            }
          : subGroup,
      ),
    }));
  };

  const toggleAttribute = (
    groupIndex: number,
    subGroupIndex: number,
    attributeIndex: number,
    checked: boolean,
  ) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      subGroups: group.subGroups.map((subGroup, sgIndex) =>
        sgIndex === subGroupIndex
          ? {
              ...subGroup,
              attributes: subGroup.attributes.map((attribute, attrIndex) =>
                attrIndex === attributeIndex
                  ? { ...attribute, isSelected: checked }
                  : attribute,
              ),
            }
          : subGroup,
      ),
    }));
  };

  const addGroup = (groupName: string) => {
    setCategories((prev) => [
      ...prev,
      {
        groupName: groupName || "New Group",
        isSelected: false,
        isNew: true,
        subGroups: [],
      },
    ]);
  };

  const addSubGroup = (groupIndex: number, subGroupName: string) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      subGroups: [
        ...group.subGroups,
        {
          subGroupName: subGroupName || "New Subgroup",
          isSelected: false,
          isNew: true,
          attributes: [],
        },
      ],
    }));
  };

  const addAttribute = (
    groupIndex: number,
    subGroupIndex: number,
    attributeName: string,
    attributeDescription: string,
  ) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      subGroups: group.subGroups.map((subGroup, index) =>
        index === subGroupIndex
          ? {
              ...subGroup,
              attributes: [
                ...subGroup.attributes,
                {
                  attributeName: attributeName || "New Attribute",
                  attributeDescription: attributeDescription || "",
                  isSelected: false,
                  isNew: true,
                },
              ],
            }
          : subGroup,
      ),
    }));
  };

  const updateGroupName = (groupIndex: number, groupName: string) => {
    updateGroup(groupIndex, (group) => ({ ...group, groupName }));
  };

  const updateSubGroupName = (
    groupIndex: number,
    subGroupIndex: number,
    subGroupName: string,
  ) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      subGroups: group.subGroups.map((subGroup, index) =>
        index === subGroupIndex ? { ...subGroup, subGroupName } : subGroup,
      ),
    }));
  };

  const updateAttributeName = (
    groupIndex: number,
    subGroupIndex: number,
    attributeIndex: number,
    attributeName: string,
  ) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      subGroups: group.subGroups.map((subGroup, sgIndex) =>
        sgIndex === subGroupIndex
          ? {
              ...subGroup,
              attributes: subGroup.attributes.map((attribute, attrIndex) =>
                attrIndex === attributeIndex
                  ? { ...attribute, attributeName }
                  : attribute,
              ),
            }
          : subGroup,
      ),
    }));
  };

  const openDrawerForGroup = () => {
    setDrawerMode("group");
    setDrawerGroupIndex(null);
    setDrawerSubGroupIndex(null);
  };

  const openDrawerForSubGroup = (groupIndex: number) => {
    setDrawerMode("subgroup");
    setDrawerGroupIndex(groupIndex);
    setDrawerSubGroupIndex(null);
  };

  const openDrawerForAttribute = (
    groupIndex: number,
    subGroupIndex: number,
  ) => {
    setDrawerMode("attribute");
    setDrawerGroupIndex(groupIndex);
    setDrawerSubGroupIndex(subGroupIndex);
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setDrawerGroupIndex(null);
    setDrawerSubGroupIndex(null);
  };

  const handleDrawerSave = (payload: AddDrawerPayload) => {
    if (!drawerMode) return;

    if (drawerMode === "group") {
      addGroup(payload.name.trim());
    } else if (
      drawerMode === "subgroup" &&
      typeof drawerGroupIndex === "number"
    ) {
      addSubGroup(drawerGroupIndex, payload.name.trim());
    } else if (
      drawerMode === "attribute" &&
      typeof drawerGroupIndex === "number" &&
      typeof drawerSubGroupIndex === "number"
    ) {
      addAttribute(
        drawerGroupIndex,
        drawerSubGroupIndex,
        payload.name.trim(),
        payload.attributeDescription ?? "",
      );
    }

    closeDrawer();
  };
  const userEmail = localStorage.getItem("user_email") || "";

  function convertStructure(data: CategoryGroup[]) {
    return data.reduce<
      Record<string, Record<string, Array<Record<string, string>>>>
    >((result, group) => {
      if (!group.isSelected) return result;

      result[group.groupName] = group.subGroups.reduce<
        Record<string, Array<Record<string, string>>>
      >((subResult, subGroup) => {
        if (!subGroup.isSelected) return subResult;

        subResult[subGroup.subGroupName] = subGroup.attributes
          .filter((attr) => attr.isSelected)
          .map((attr) => ({
            [attr.attributeName]: attr.attributeDescription,
          }));

        return subResult;
      }, {});

      return result;
    }, {});
  }

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveDone = (payload: SaveDrawerPayload) => {
    setIsSubmitting(true);
    // console.log(
    //   "Save Data Category",
    //   {
    //     categoryName: payload.name,
    //     description: payload.description,
    //     sourceCategory: DataCategory,
    //     originalCategory: dataCategory,
    //     attributes: categories,
    //   },
    //   "sdasdadas",
    //   convertStructure(categories)
    // );

    const requestbody = {
      category: payload.name,
      description: payload.description,
      status: "pending",
      user: userEmail,
      attributes: convertStructure(categories),
    };

    DataCategoryAPI?.createDataCategory(requestbody)
      .then((response) => {
        console.log("dsssfdf", response);
        if (response?.status === 200) {
          showSnackbar(response?.data?.message || "Data Category created!");
          setIsSaveDrawerOpen(false);
          navigate("/data-category/");
        } else {
          showSnackbar("Failed to create Data Category.", "error");
        }
      })
      .catch(() => {
        showSnackbar("Failed to create Data Category.", "error");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const hasAnySelectedAttributes = categories.some((group) =>
    group.subGroups.some((subGroup) =>
      subGroup.attributes.some((attribute) => attribute.isSelected),
    ),
  );

  return (
    <div className="px-4 py-2 mb-4">
      <BreadCrumbs items={BreadcrumbsData} />

      <div className="mx-auto mt-4 max-w-[1000px] space-y-4">
        <div className="flex justify-between  align-center form-container">
          {Mode === "view" ? (
            <p className="text-[0.94rem] mt-1 font-semibold text-font-color-primary">
              {dataCategory?.category}
            </p>
          ) : (
            <TextField
              size="small"
              color="success"
              sx={{ width: "24rem" }}
              value={newDataCategoryName}
              onChange={(event) => setNewDataCategoryName(event.target.value)}
            />
          )}

          {Mode === "view" ? (
            <div>
              <Button
                color="primary"
                variant="primary"
                className="min-w-[6rem]"
                onClick={() => {
                  navigate(
                    `/data-category/view?mode=modify&dc=${DataCategory}`,
                  );
                }}
              >
                <Pencil />
                Modify
              </Button>
            </div>
          ) : (
            <div>
              <Button
                color="primary"
                variant="primary"
                className="min-w-[6rem]"
                disabled={!hasAnySelectedAttributes}
                onClick={() => setIsSaveDrawerOpen(true)}
              >
                <Save />
                Save
              </Button>
            </div>
          )}
        </div>

        {categories.map((group, groupIndex) => {
          const groupSelection = getGroupSelectionState(group);

          return (
            <section
              key={`${group.groupName}-${groupIndex}`}
              className="overflow-hidden rounded-md bg-white shadow-card"
            >
              <div className="flex items-center gap-2.5 bg-[#f0fdf4] px-4 py-2.5">
                {isModifyMode && (
                  <GreenCheckbox
                    checked={groupSelection.checked}
                    indeterminate={groupSelection.indeterminate}
                    ariaLabel={`Select ${group.groupName}`}
                    onChange={(checked) => toggleGroup(groupIndex, checked)}
                  />
                )}
                <EditableName
                  value={group.groupName}
                  isNew={group.isNew}
                  onChange={(value) => updateGroupName(groupIndex, value)}
                  className="text-[0.86rem] font-semibold"
                />
              </div>

              <div className="space-y-6 px-4 py-4">
                {group.subGroups.map((subGroup, subGroupIndex) => {
                  const subGroupSelection = getSubGroupSelectionState(subGroup);

                  return (
                    <div key={`${subGroup.subGroupName}-${subGroupIndex}`}>
                      <div className="mb-3 flex items-center gap-2.5">
                        {isModifyMode && (
                          <GreenCheckbox
                            checked={subGroupSelection.checked}
                            indeterminate={subGroupSelection.indeterminate}
                            ariaLabel={`Select ${subGroup.subGroupName}`}
                            onChange={(checked) =>
                              toggleSubGroup(groupIndex, subGroupIndex, checked)
                            }
                          />
                        )}
                        <EditableName
                          value={subGroup.subGroupName}
                          isNew={subGroup.isNew}
                          onChange={(value) =>
                            updateSubGroupName(groupIndex, subGroupIndex, value)
                          }
                          className="text-[0.84rem] font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {subGroup.attributes.map(
                          (attribute, attributeIndex) => (
                            <div
                              key={`${attribute.attributeName}-${attributeIndex}`}
                              className="flex items-start gap-2.5 text-left"
                            >
                              {isModifyMode && (
                                <GreenCheckbox
                                  checked={attribute.isSelected}
                                  ariaLabel={`Select ${attribute.attributeName}`}
                                  onChange={(checked) =>
                                    toggleAttribute(
                                      groupIndex,
                                      subGroupIndex,
                                      attributeIndex,
                                      checked,
                                    )
                                  }
                                />
                              )}
                              <EditableName
                                value={attribute.attributeName}
                                isNew={attribute.isNew}
                                onChange={(value) =>
                                  updateAttributeName(
                                    groupIndex,
                                    subGroupIndex,
                                    attributeIndex,
                                    value,
                                  )
                                }
                                className="text-[0.82rem] text-[#313131]"
                              />
                            </div>
                          ),
                        )}
                      </div>

                      {isModifyMode && (
                        <AddAction
                          label="Add attribute"
                          onClick={() =>
                            openDrawerForAttribute(groupIndex, subGroupIndex)
                          }
                        />
                      )}
                    </div>
                  );
                })}

                {isModifyMode && (
                  <AddAction
                    label="Add subgroup"
                    onClick={() => openDrawerForSubGroup(groupIndex)}
                    className="mt-0"
                  />
                )}
              </div>
            </section>
          );
        })}

        {isModifyMode && (
          <AddAction
            label="Add group"
            onClick={openDrawerForGroup}
            className="mt-2"
          />
        )}
      </div>
      {isModifyMode && (
        <AddDrawer
          open={drawerMode !== null}
          mode={drawerMode}
          onClose={closeDrawer}
          onSave={handleDrawerSave}
        />
      )}
      {isModifyMode && (
        <SaveDrawer
          open={isSaveDrawerOpen}
          defaultName={newDataCategoryName}
          onClose={() => setIsSaveDrawerOpen(false)}
          onDone={handleSaveDone}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

export default ModifyDataCategory;

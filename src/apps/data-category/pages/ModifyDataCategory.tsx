import DataCategoryAPI from "@/api/data-category";
import BreadCrumbs from "@/components/common/BreadCrumbs";
import AddDrawer, { type AddDrawerPayload } from "../components/AddDrawer";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { transformAttributes } from "../components/datatransfomer";

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
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
      className
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
    (item) => item.isSelected
  ).length;

  return {
    checked: selectedCount > 0 && selectedCount === subGroup.attributes.length,
    indeterminate:
      selectedCount > 0 && selectedCount < subGroup.attributes.length,
  };
};

const ModifyDataCategory = () => {
  const [categories, setCategories] = useState<CategoryGroup[]>(() =>
    normalizeCategoryData(templateDataSample)
  );
  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [drawerGroupIndex, setDrawerGroupIndex] = useState<number | null>(null);
  const [drawerSubGroupIndex, setDrawerSubGroupIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    DataCategoryAPI.getDataCategory("Mobius Standard Abstraction").then(
      (response) => {
        if (response.status === 200) {
          const category = response.data[0];
          const transformedData = transformAttributes(category?.attributes);
          if (transformedData.length > 0) {
            setCategories(normalizeCategoryData(transformedData));
          }
        }
      }
    );
  }, []);

  const updateGroup = (
    groupIndex: number,
    updater: (group: CategoryGroup) => CategoryGroup
  ) => {
    setCategories((prev) =>
      prev.map((group, index) =>
        index === groupIndex ? updater(group) : group
      )
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
    checked: boolean
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
          : subGroup
      ),
    }));
  };

  const toggleAttribute = (
    groupIndex: number,
    subGroupIndex: number,
    attributeIndex: number,
    checked: boolean
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
                  : attribute
              ),
            }
          : subGroup
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
    attributeDescription: string
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
          : subGroup
      ),
    }));
  };

  const updateGroupName = (groupIndex: number, groupName: string) => {
    updateGroup(groupIndex, (group) => ({ ...group, groupName }));
  };

  const updateSubGroupName = (
    groupIndex: number,
    subGroupIndex: number,
    subGroupName: string
  ) => {
    updateGroup(groupIndex, (group) => ({
      ...group,
      subGroups: group.subGroups.map((subGroup, index) =>
        index === subGroupIndex ? { ...subGroup, subGroupName } : subGroup
      ),
    }));
  };

  const updateAttributeName = (
    groupIndex: number,
    subGroupIndex: number,
    attributeIndex: number,
    attributeName: string
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
                  : attribute
              ),
            }
          : subGroup
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
    subGroupIndex: number
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
        payload.attributeDescription ?? ""
      );
    }

    closeDrawer();
  };

  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
      <h5 className="mt-4 text-[0.98rem] font-semibold text-font-color-primary">
        Modify Data Category
      </h5>

      <div className="mx-auto mt-4 max-w-[1000px] space-y-4">
        {categories.map((group, groupIndex) => {
          const groupSelection = getGroupSelectionState(group);

          return (
            <section
              key={`${group.groupName}-${groupIndex}`}
              className="overflow-hidden rounded-md bg-white shadow-card"
            >
              <div className="flex items-center gap-2.5 bg-[#f0fdf4] px-4 py-3">
                <GreenCheckbox
                  checked={groupSelection.checked}
                  indeterminate={groupSelection.indeterminate}
                  ariaLabel={`Select ${group.groupName}`}
                  onChange={(checked) => toggleGroup(groupIndex, checked)}
                />
                <EditableName
                  value={group.groupName}
                  isNew={group.isNew}
                  onChange={(value) => updateGroupName(groupIndex, value)}
                  className="text-[0.92rem] font-semibold"
                />
              </div>

              <div className="space-y-6 px-4 py-4">
                {group.subGroups.map((subGroup, subGroupIndex) => {
                  const subGroupSelection = getSubGroupSelectionState(subGroup);

                  return (
                    <div key={`${subGroup.subGroupName}-${subGroupIndex}`}>
                      <div className="mb-3 flex items-center gap-2.5">
                        <GreenCheckbox
                          checked={subGroupSelection.checked}
                          indeterminate={subGroupSelection.indeterminate}
                          ariaLabel={`Select ${subGroup.subGroupName}`}
                          onChange={(checked) =>
                            toggleSubGroup(groupIndex, subGroupIndex, checked)
                          }
                        />
                        <EditableName
                          value={subGroup.subGroupName}
                          isNew={subGroup.isNew}
                          onChange={(value) =>
                            updateSubGroupName(groupIndex, subGroupIndex, value)
                          }
                          className="text-[0.86rem] font-semibold"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        {subGroup.attributes.map(
                          (attribute, attributeIndex) => (
                            <label
                              key={`${attribute.attributeName}-${attributeIndex}`}
                              className="flex items-start gap-2.5 text-left"
                            >
                              <GreenCheckbox
                                checked={attribute.isSelected}
                                ariaLabel={`Select ${attribute.attributeName}`}
                                onChange={(checked) =>
                                  toggleAttribute(
                                    groupIndex,
                                    subGroupIndex,
                                    attributeIndex,
                                    checked
                                  )
                                }
                              />
                              <EditableName
                                value={attribute.attributeName}
                                isNew={attribute.isNew}
                                onChange={(value) =>
                                  updateAttributeName(
                                    groupIndex,
                                    subGroupIndex,
                                    attributeIndex,
                                    value
                                  )
                                }
                                className="text-[0.82rem] text-[#00000090]"
                              />
                            </label>
                          )
                        )}
                      </div>

                      <AddAction
                        label="Add attribute"
                        onClick={() =>
                          openDrawerForAttribute(groupIndex, subGroupIndex)
                        }
                      />
                    </div>
                  );
                })}

                <AddAction
                  label="Add subgroup"
                  onClick={() => openDrawerForSubGroup(groupIndex)}
                  className="mt-0"
                />
              </div>
            </section>
          );
        })}

        <AddAction
          label="Add group"
          onClick={openDrawerForGroup}
          className="mt-2"
        />
      </div>
      <AddDrawer
        open={drawerMode !== null}
        mode={drawerMode}
        onClose={closeDrawer}
        onSave={handleDrawerSave}
      />
    </div>
  );
};

export default ModifyDataCategory;

const templateDataSample = [
  {
    groupName: "Details",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Premises Details",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Property name",
            attributeDescription:
              "Name of the property or complex where the leased premises is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street",
            attributeDescription: "Street name of the property address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street no.",
            attributeDescription: "Street number of the property address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Postal code",
            attributeDescription: "ZIP or postal code of the property address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "City",
            attributeDescription: "City where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "County",
            attributeDescription: "County where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "State / province",
            attributeDescription:
              "State or province where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Country",
            attributeDescription: "Country where the property is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Building Type",
            attributeDescription:
              "Type or classification of the building (e.g., office, retail, industrial)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Total building area",
            attributeDescription: "Total area of the building in square units",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "UOM",
            attributeDescription:
              "Unit of measurement used for area (e.g., SF, SM)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Unit/suite number",
            attributeDescription: "Number of the leased unit or suite",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Type",
            attributeDescription:
              "Type of space leased (e.g., retail, office, warehouse)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Gross area",
            attributeDescription: "Total gross area of the leased premises",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Gross Area UOM",
            attributeDescription: "Unit of measurement for gross area",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Net area",
            attributeDescription: "Net usable area of the leased premises",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Net Area UOM",
            attributeDescription: "Unit of measurement for net area",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Floor no.",
            attributeDescription: "Floor number where the premises is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Start date",
            attributeDescription:
              "Start date of the lease for the specified unit/space",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "End date",
            attributeDescription:
              "End date of the lease for the specified unit/space",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Duration",
            attributeDescription:
              "Length of lease term for the specific premises",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Parties",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Landlord Name",
            attributeDescription: "Legal name of the landlord or lessor",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Tenant Name",
            attributeDescription: "Legal name of the tenant or lessee",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Contacts",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Contact type",
            attributeDescription:
              "Role or type of contact (e.g., landlord, tenant, broker)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Name",
            attributeDescription: "Name of the contact person or entity",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Attention",
            attributeDescription:
              "Person to whom correspondence is specifically addressed",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Care of",
            attributeDescription: "Secondary recipient or care-of entity",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "DBA",
            attributeDescription:
              "Doing business as name if different from legal name",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street",
            attributeDescription: "Street name of the contact address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Street no.",
            attributeDescription: "Street number of the contact address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Suite",
            attributeDescription: "Suite number in the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "P.O. Box",
            attributeDescription: "Post office box number",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Zip code",
            attributeDescription: "ZIP or postal code of the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "City",
            attributeDescription: "City of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "County",
            attributeDescription: "County where the contact is located",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "State / province",
            attributeDescription: "State or province of the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Country",
            attributeDescription: "Country of the address",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Additional address details",
            attributeDescription: "Any additional descriptive address details",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Phone",
            attributeDescription: "Phone number of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Mobile",
            attributeDescription: "Mobile number of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Fax",
            attributeDescription: "Fax number of the contact",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Email",
            attributeDescription: "Email address of the contact",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Dates",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Key Dates",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Effective Date",
            attributeDescription:
              "Date the lease agreement becomes legally binding",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Execution Date",
            attributeDescription:
              "Date the lease agreement is signed by all parties",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Original Commencement Date",
            attributeDescription: "Initial start date of the lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Rent Commencement Date",
            attributeDescription:
              "Date on which rent payment obligations begin",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Current Commencement Date",
            attributeDescription: "Start date of the current lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Current Expiration Date",
            attributeDescription: "End date of the current lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Original Expiration Date",
            attributeDescription: "Initial end date of the lease term",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Possession Date",
            attributeDescription:
              "Date the tenant takes possession of the premises",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Delivery Date",
            attributeDescription:
              "Date the premises are delivered to the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Term Duration",
            attributeDescription: "Total duration of the lease term in months",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Lease Status",
            attributeDescription:
              "Current status of the lease (e.g., pending, active, expired, terminated)",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Misc",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Misc",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "PRS",
            attributeDescription:
              "Pro-rata share of expenses borne by the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Base Year",
            attributeDescription:
              "Base year used for expense escalation calculations",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Monetory",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Base Rent",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Start date",
            attributeDescription: "Start date of the rent period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "End date",
            attributeDescription: "End date of the rent period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Monthly Amount",
            attributeDescription:
              "Monthly base rent amount payable by the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Monthly Amount per SF",
            attributeDescription: "Monthly rent amount per square foot",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Annual Amount",
            attributeDescription: "Total annual base rent amount",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Annual amount per SF",
            attributeDescription: "Annual rent amount per square foot",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Currency",
            attributeDescription: "Currency in which rent is payable",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "On Day",
            attributeDescription: "Day of the month on which rent is due",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Payment Frequency",
            attributeDescription:
              "Frequency of rent payments (e.g., monthly, quarterly)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount",
            attributeDescription: "Amount of rent increase",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount Unit",
            attributeDescription: "Unit for rent increase (e.g., %, $)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount per area",
            attributeDescription: "Amount of rent increase per unit area",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Increase amount per area Unit",
            attributeDescription: "Unit for increase per area (e.g., per SF)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Basis of increase",
            attributeDescription:
              "Reason or method of rent increase (e.g., CPI, fixed)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Rent Increase Start date",
            attributeDescription: "Start date of rent increase period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Rent Increase End date",
            attributeDescription: "End date of rent increase period",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Interval",
            attributeDescription: "Time interval between rent increases",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Expense Items",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Electricity",
            attributeDescription:
              "Responsibility and terms for electricity charges",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Roof",
            attributeDescription: "Responsibility and terms for roof repairs",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "HVAC",
            attributeDescription:
              "Responsibility and terms for HVAC maintenance",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Common Area",
            attributeDescription: "Responsibility for maintaining shared areas",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Snow Removal",
            attributeDescription: "Responsibility for snow clearing",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Water",
            attributeDescription: "Responsibility and terms for water utility",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Trash",
            attributeDescription: "Responsibility for terms for trash removal",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Janitorial",
            attributeDescription:
              "Responsibility for terms for cleaning services",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Utility Lines",
            attributeDescription:
              "Responsibility for terms for utility infrastructure",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Security Deposit",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Security Deposit Type",
            attributeDescription:
              "Form in which the security deposit is held (e.g., cash, letter of credit)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Security Deposit Amount",
            attributeDescription: "Amount of the security deposit",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Security Deposit Currency",
            attributeDescription: "Currency of the security deposit amount",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Payment Date",
            attributeDescription: "Date the security deposit was paid",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Return Due Date",
            attributeDescription:
              "Deadline for returning the deposit to the tenant",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Security Deposit Comments",
            attributeDescription:
              "Additional notes or conditions related to the security deposit",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Allowance",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Allowance Type",
            attributeDescription:
              "Type of allowance provided (e.g., TI allowance, moving allowance)",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Allowance Amount",
            attributeDescription: "Amount provided for the allowance",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Payment Deadline",
            attributeDescription: "Deadline for the payment of the allowance",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Allowance Comments",
            attributeDescription:
              "Additional notes or conditions related to the allowance",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
  {
    groupName: "Clauses",
    isSelected: "false",
    isNew: false,
    subGroups: [
      {
        subGroupName: "Clauses",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Assignment/Sublet",
            attributeDescription:
              "Paraphrased paragraph of the Assignment/Sublet clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Alterations",
            attributeDescription:
              "Paraphrased paragraph of the Alterations clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Default",
            attributeDescription:
              "Paraphrased paragraph of the Default clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Continuous Operation",
            attributeDescription:
              "Paraphrased paragraph of the Continuous Operation clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Casualty",
            attributeDescription:
              "Paraphrased paragraph of the Casualty clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Condemnation",
            attributeDescription:
              "Paraphrased paragraph of the Condemnation clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Estoppel",
            attributeDescription:
              "Paraphrased paragraph of the Estoppel clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Business Hours",
            attributeDescription:
              "Paraphrased paragraph of the Business Hours clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Financial Statement",
            attributeDescription:
              "Paraphrased paragraph of the Financial Statement clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Late Charges",
            attributeDescription:
              "Paraphrased paragraph of the Late Charges clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Repair and Maintenance",
            attributeDescription:
              "Paraphrased paragraph of the Repair and Maintenance clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Insurance Requirements",
            attributeDescription:
              "Paraphrased paragraph of the Insurance Requirements clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Operating Expenses",
            attributeDescription:
              "Paraphrased paragraph of the Operating Expenses clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "RE Taxes",
            attributeDescription:
              "Paraphrased paragraph of the RE Taxes clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Property Insurance",
            attributeDescription:
              "Paraphrased paragraph of the Property Insurance clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Parking",
            attributeDescription:
              "Paraphrased paragraph of the Parking clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Signage",
            attributeDescription:
              "Paraphrased paragraph of the Signage clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "SNDA",
            attributeDescription:
              "Paraphrased paragraph of the SNDA clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Surrender",
            attributeDescription:
              "Paraphrased paragraph of the Surrender clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Holdover",
            attributeDescription:
              "Paraphrased paragraph of the Holdover clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Permitted Use",
            attributeDescription:
              "Paraphrased paragraph of the Permitted Use clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Restricted Uses",
            attributeDescription:
              "Paraphrased paragraph of the Restricted Uses clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Prohibited Uses",
            attributeDescription:
              "Paraphrased paragraph of the Prohibited Uses clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Exclusive Use",
            attributeDescription:
              "Paraphrased paragraph of the Exclusive Use clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Percentage Rent (Payment)",
            attributeDescription:
              "Paraphrased paragraph of the Percentage Rent (Payment) clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Gross Sales (Reporting)",
            attributeDescription:
              "Paraphrased paragraph of the Gross Sales (Reporting) clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Go dark",
            attributeDescription:
              "Paraphrased paragraph of the Go dark clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Co-Tenancy",
            attributeDescription:
              "Paraphrased paragraph of the Co-Tenancy clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Radius Restrictions",
            attributeDescription:
              "Paraphrased paragraph of the Radius Restrictions clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Tenant Improvement Allowance",
            attributeDescription:
              "Paraphrased paragraph of the Tenant Improvement Allowance clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Brokers",
            attributeDescription:
              "Paraphrased paragraph of the Brokers clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Notices",
            attributeDescription:
              "Paraphrased paragraph of the Notices clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Base Rent Comments",
            attributeDescription:
              "Paraphrased paragraph of the Base Rent Comments clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Utilities",
            attributeDescription:
              "Paraphrased paragraph of the Utilities clause from the lease, capturing key terms and obligations.",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
      {
        subGroupName: "Options",
        isSelected: "false",
        isNew: false,
        attributes: [
          {
            attributeName: "Renewal Option",
            attributeDescription:
              "Paraphrased paragraph of the renewal option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Auto-Renewal Option",
            attributeDescription:
              "Paraphrased paragraph of the auto renewal option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Termination Option - One-Time",
            attributeDescription:
              "Paraphrased paragraph of the one time termination option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Termination Option - Ongoing",
            attributeDescription:
              "Paraphrased paragraph of the ongoing termination option clause from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Sales Kick Out",
            attributeDescription:
              "Paraphrased paragraph of the sales kick out from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Expansion Option",
            attributeDescription:
              "Paraphrased paragraph of the expansion option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Contraction Option",
            attributeDescription:
              "Paraphrased paragraph of the contraction option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "ROFO",
            attributeDescription:
              "Paraphrased paragraph of the ROFO option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "ROFR",
            attributeDescription:
              "Paraphrased paragraph of the ROFR option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Purchase",
            attributeDescription:
              "Paraphrased paragraph of the purchase option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
          {
            attributeName: "Relocation",
            attributeDescription:
              "Paraphrased paragraph of the relocation option from the lease, detailing conditions, timeframes, and rights.",
            isSelected: "false",
            isNew: false,
          },
        ],
      },
    ],
  },
];

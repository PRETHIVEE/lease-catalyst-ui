export function convertLeaseData(data: any) {
  return Object.entries(data).map(([groupName, subGroups]) => ({
    groupName,
    subGroups: Object.entries(subGroups).map(([subGroupName, attributes]) => ({
      subGroupName,
      attributes: attributes.map((attr) => {
        const [attributeName, attributeDescription] = Object.entries(attr)[0];
        return { attributeName, attributeDescription };
      }),
    })),
  }));
}

// export function convertLeaseData(data: Record<string, any>) {
//   return Object.entries(data).map(([groupName, subGroups]) => ({
//     groupName,
//     subGroups: Object.entries(subGroups).map(([subGroupName, attributes]) => {
//       if (!Array.isArray(attributes)) {
//         console.warn(
//           `Expected array for ${groupName} > ${subGroupName}, got:`,
//           typeof attributes
//         );
//         return { subGroupName, attributes: [] };
//       }
//       return {
//         subGroupName,
//         attributes: attributes.map((attr) => {
//           const [attributeName, attributeDescription] = Object.entries(
//             attr
//           )[0] as [string, string];
//           return { attributeName, attributeDescription };
//         }),
//       };
//     }),
//   }));
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformAttributes(attributes: any[]) {
  const data = Object.entries(attributes).map(([group_name, raw_sub_group]) => {
    return {
      groupName: group_name,
      isSelected: "false",
      isNew: false,
      subGroups: Object.entries(raw_sub_group).map(
        ([sub_group_name, raw_attributes]) => {
          return {
            subGroupName: sub_group_name,
            isSelected: "false",
            isNew: false,
            attributes: Array.isArray(raw_attributes)
              ? raw_attributes.map((attribute) => {
                  const attributeName = Object.keys(attribute)[0];
                  const attributeDescription = attribute[attributeName];
                  return {
                    attributeName: attributeName,
                    attributeDescription: attributeDescription,
                    isSelected: "false",
                    isNew: false,
                  };
                })
              : [],
          };
        }
      ),
    };
  });
  return data;
}

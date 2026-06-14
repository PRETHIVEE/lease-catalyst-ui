import { Button } from "@/components/ui/button";
import { Download, Edit } from "lucide-react";
import { sampleleaseabstractiondata } from "./sampledata";

const LeaseAbstraction = ({ propertyName }: { propertyName: any }) => {
  return (
    <div className="mt-1.2">
      <div className="flex justify-end items-center gap-3 mt-2">
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Edit /> Edit Lease
        </Button>
        <Button variant="primary" size="sm">
          <Download /> Download
        </Button>
      </div>

      <div className="mx-auto mt-4 max-w-[1000px] space-y-4">
        {sampleleaseabstractiondata.map((group) => (
          <section
            key={group.groupName}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-300 bg-slate-100 px-4 py-2">
              <h2 className="text-[0.8rem] font-semibold uppercase text-slate-700">
                {group.groupName}
              </h2>
            </div>

            <div className="space-y-6 p-4">
              {group.subGroups.map((subGroup) => (
                <div key={subGroup.subGroupName} className="space-y-3">
                  <div className="rounded-md bg-[#f0fdf4] px-3 py-2 text-sm font-semibold text-slate-800">
                    {subGroup.subGroupName}
                  </div>
                  <div className="overflow-hidden rounded-sm border border-slate-200">
                    <table className="min-w-full border-collapse text-left text-sm">
                      <tbody className="divide-y divide-slate-200">
                        {subGroup.attributes.map((attribute) => (
                          <tr
                            key={attribute.attributeName}
                            className="bg-white hover:bg-gray-100 transition-colors text-[0.8rem]"
                          >
                            <td className="w-1/3 whitespace-nowrap px-4 py-1.5 font-medium text-slate-900">
                              {attribute.attributeName}
                            </td>
                            <td className="px-4 py-1.5 text-gray-500">
                              {attribute?.attributeName === "Property name" ? (
                                <>{propertyName}</>
                              ) : (
                                <>{attribute.attributeValue ?? "-"}</>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default LeaseAbstraction;

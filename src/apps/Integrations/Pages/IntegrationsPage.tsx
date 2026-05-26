import BreadCrumbs from "@/components/common/BreadCrumbs";
import IntegrationCard from "../components/IntegrationCard";

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
  { label: "Integrations", url: "/" },
];

const integrations = [
  {
    id: "salesforce",
    title: "Salesforce",
    description:
      "Cloud CRM where lease agreements and tenant records are managed and ingested.",
    iconSrc: "/integrations/images.png",
    iconContainerClassName: "bg-[#e8f4fc]",
  },
  {
    id: "sharepoint",
    title: "SharePoint",
    description:
      "Document collaboration hub used to store and route lease files for abstraction.",
    iconSrc: "/integrations/microsoft-sharepoint.webp",
    iconContainerClassName: "bg-[#e6f7f5]",
  },
  {
    id: "amazon-s3",
    title: "Amazon S3",
    description:
      "Scalable, secure object storage for large lease repositories.",
    iconSrc: "/integrations/amazon-s3.png",
    iconContainerClassName: "bg-[#fdf0ee]",
  },
  {
    id: "box",
    title: "Box",
    description:
      "Secure content cloud to share, govern and pull in lease documents.",
    iconSrc: "/integrations/box-box.jpg",
    iconContainerClassName: "bg-[#e8f0fc]",
  },
  {
    id: "ftp",
    title: "FTP",
    description:
      "Bulk transfer of lease document batches from legacy systems and partners.",
    iconSrc: "/integrations/ftp.jfif",
    iconContainerClassName: "bg-[#f3f4f6]",
  },
];

const integrationDestination = [
  {
    id: "lease-harbour",
    title: "Lease Harbour",
    description:
      "Lease administration and FASB / IFRS-compliant accounting platform.",
    iconSrc: "/integrations/lease-harbour.png",
    iconContainerClassName: "bg-[#e8f4fc]",
  },
  {
    id: "pro-lease",
    title: "Pro Lease",
    description:
      "Real estate and equipment lease accounting and administration.",
    iconSrc: "/integrations/prolease.png",
    iconContainerClassName: "bg-[#e8f4fc]",
  },
  {
    id: "sequentra",
    title: "Sequentra",
    description: "Cloud lease and portfolio management for global occupiers.",
    iconSrc: "/integrations/sequentra.webp",
    iconContainerClassName: "bg-[#e8f4fc]",
  },
  {
    id: "yardi",
    title: "Yardi",
    description:
      "Property management and accounting platform across all asset classes.",
    iconSrc: "/integrations/yardi.png",
    iconContainerClassName: "bg-[#e8f4fc]",
  },
];

const IntegrationsPage = () => {
  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
      <h5 className="mt-4 text-[0.98rem] font-semibold text-font-color-primary">
        Integrations
      </h5>

      <>
        <div className="mt-2.5">
          <h5 className="text-[0.92rem] font-semibold text-font-color-primary">
            Source
          </h5>
          <p className="mt text-[0.81rem] leading-snug text-[#00000090]">
            Connect enterprise systems to ingest lease documents seamlessly.
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {integrations.map((integration) => (
            <IntegrationCard
              key={integration.id}
              title={integration.title}
              description={integration.description}
              imgUrl={integration.iconSrc}
              iconContainerClassName={integration.iconContainerClassName}
              onInstall={() => {}}
            />
          ))}
        </div>
      </>

      <>
        <div className="mt-8">
          <h5 className="text-[0.92rem] font-semibold text-font-color-primary">
            Destination
          </h5>
          <p className="mt text-[0.81rem] leading-snug text-[#00000090]">
            Structured lease data flows into downstream property & lease
            management platforms.
          </p>
        </div>
        <div className="mt-4 my-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {integrationDestination.map((integration) => (
            <IntegrationCard
              key={integration.id}
              title={integration.title}
              description={integration.description}
              imgUrl={integration.iconSrc}
              iconContainerClassName={integration.iconContainerClassName}
              onInstall={() => {}}
              imgWidth="large"
            />
          ))}
        </div>
      </>
    </div>
  );
};

export default IntegrationsPage;

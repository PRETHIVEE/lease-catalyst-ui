import BreadCrumbs from "@/components/common/BreadCrumbs";

import EventsList from "../components/EventsList";

const BreadcrumbsData = [
  { label: "Home", url: "/dashboard" },
  { label: "Events", url: "/events" },
];

const EventsPage = () => {
  return (
    <div className="px-4 py-2">
      <BreadCrumbs items={BreadcrumbsData} />
      <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
        Events
      </h5>

      <EventsList />
    </div>
  );
};

export default EventsPage;

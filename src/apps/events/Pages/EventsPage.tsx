import EventsList from "../components/EventsList";

const EventsPage = () => {
  return (
    <div className="px-4 py-2">
      <h5 className="text-[0.98rem] px-0.5 font-semibold text-font-color-primary mt-1.5">
        Events
      </h5>

      <EventsList />
    </div>
  );
};

export default EventsPage;

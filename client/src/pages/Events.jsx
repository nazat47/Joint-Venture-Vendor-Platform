import React from "react";
import Header from "../components/layout/Header";
import EventCard from "../components/route/events/EventCard";
import { useSelector } from "react-redux";

const Events = () => {
  const { allEvents } = useSelector((state) => state.event);
  return (
    <div>
      <Header activeHeading={4} />
      {allEvents !== null && (
        <>
          {allEvents.map((event, i) => (
            <EventCard active={true} product={event} key={i} />
          ))}
        </>
      )}
    </div>
  );
};

export default Events;

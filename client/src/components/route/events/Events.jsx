import React, { useEffect } from "react";
import styles from "../../../styles/styles";
import EventCard from "./EventCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  EventFailure,
  EventRequest,
  getAllEvents,
} from "../../../redux/reducers/eventSlice";

const Events = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const dispatch = useDispatch();
  const { allEvents } = useSelector((state) => state.event);
  useEffect(() => {
    const getallEvents = async () => {
      try {
        dispatch(EventRequest());
        const { data } = await axios.get(`${REACT_APP_BASE_URL}/event/getAll`);
        if (data.msg) {
          dispatch(EventFailure(data?.msg));
          toast.error(data?.msg);
        }
        dispatch(getAllEvents(data));
      } catch (error) {
        dispatch(EventFailure(error.message));
        toast.error(error.message);
      }
    };
    getallEvents();
  }, []);
  return (
    <div className="mt-12">
      {allEvents?.length > 0 && (
        <div className={`${styles.section}`}>
          <div className={`${styles.heading}`}>
            <h1>Popular Events</h1>
          </div>
          <div className="w-full grid">
            <EventCard product={allEvents && allEvents[0]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;

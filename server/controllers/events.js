const Shop = require("../models/shop");
const Event = require("../models/events");
const { Unauthenticated, BadRequest, NotFound } = require("../errors");
const fs = require("fs");

const createEvent = async (req, res) => {
  const { shopId } = req.body;
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new BadRequest("Shop not found");
  }
  if (req.body.category === "Choose a category") {
    throw new BadRequest("Please select a category");
  }
  const eventData = req.body;
  eventData.images = req.body.images;
  eventData.shop = shop;
  const event = await Event.create(eventData);
  if (!event) {
    throw new BadRequest("Unable to create event");
  }
  return res.status(201).json(event);
};

const getEvents = async (req, res) => {
  const { shopId } = req.params;
  const events = await Event.find({ shopId });
  if (!events) {
    throw new NotFound("No events found");
  }
  return res.status(200).json(events);
};

const getAllEvents = async (req, res) => {
  const events = await Event.find({});
  if (!events) {
    throw new NotFound("No events found");
  }
  return res.status(200).json(events);
};

const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id);
  if (!event) {
    throw new NotFound("No event found");
  }

  const delEvent = await Event.findOneAndDelete({ _id: id });
  if (!delEvent) {
    throw new NotFound("Event not found");
  }
  return res.status(200).json({ message: "Event Deleted" });
};

module.exports = { createEvent, deleteEvent, getEvents,getAllEvents };

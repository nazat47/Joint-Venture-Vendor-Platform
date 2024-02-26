const Messages = require("../models/messages");
const { Unauthenticated, BadRequest, NotFound } = require("../errors");

const createMessage = async (req, res) => {
  const { images, sender, conversationId, text } = req.body;
  const message = await Messages.create({
    images,
    sender,
    conversationId,
    text,
  });
  if (!message) {
    throw new BadRequest("Can not create message");
  }
  return res.status(201).json(message);
};

const getAllMessages = async (req, res) => {
  const { id } = req.params;
  const messages = await Messages.find({ conversationId: id });
  if (!messages) {
    throw new NotFound("No messages found");
  }
  return res.status(201).json(messages);
};

module.exports = { createMessage, getAllMessages };

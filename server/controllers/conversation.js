const Conversation = require("../models/conversation");
const { Unauthenticated, BadRequest, NotFound } = require("../errors");

const createConversation = async (req, res) => {
  const { userId, shopId, groupTitle } = req.body;
  const isConvoExist = await Conversation.findOne({ groupTitle });
  if (isConvoExist) {
    return res.status(200).json(isConvoExist);
  }
  const conversation = await Conversation.create({
    groupTitle,
    members: [userId, shopId],
  });
  if (!conversation) {
    throw new BadRequest("Something went wrong");
  }
  return res.status(201).json(conversation);
};

const getConversations = async (req, res) => {
  const { id } = req.params;
  const conversations = await Conversation.find({
    members: {
      $in: [id],
    },
  }).sort({ createdAt: -1 });
  if (!conversations) {
    throw new BadRequest("No conversation found");
  }
  return res.status(201).json(conversations);
};

const updateLastMessage = async (req, res) => {
  const { lastMessage, lastMessageId } = req.body;
  const convo = await Conversation.findByIdAndUpdate(
    req.params.id,
    {
      lastMessage,
      lastMessageId,
    },
    { new: true, runValidators: true }
  );
  if (!convo) {
    throw new NotFound("Conversation not found");
  }
  return res.status(200).json(convo);
};

module.exports = { createConversation, getConversations, updateLastMessage };

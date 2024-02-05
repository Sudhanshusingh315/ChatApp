const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");
const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    console.log("userId is not sent with the params");
    return res.sendStatus(400);
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: req.userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("lastMessage");

  isChat = await User.populate(isChat, {
    path: "lastMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }
  try {
    const createChat = await Chat.create(chatData);
    const Fullchat = await Chat.findOne({ _id: createChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).send(Fullchat);
  } catch (error) {
    res.send(400);
    throw new Error(error.message);
  }
};

module.exports = { accessChat };

import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import styles from "../../styles/styles";

const ENDPOINT = "http://localhost:4001/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const ShopMessages = () => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const { currentShop } = useSelector((state) => state.shop);
  const [conversation, setConversation] = useState([]);
  const [open, setOpen] = useState(false);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();
  const scrollRef = useRef(null);
  useEffect(() => {
    try {
      socketId.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });
    } catch (error) {
      console.log(error);
    }
  }, []);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);
  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/conversation/getAll/${currentShop?._id}`
        );
        if (data.msg) {
          toast.error(data.msg);
        } else {
          setConversation(data);
        }
      } catch (error) {
        toast.error(error.response?.data?.msg);
        console.log(error);
      }
    };
    getAll();
  }, [currentShop, messages]);

  useEffect(() => {
    if (currentShop) {
      const userId = currentShop?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [currentShop]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find(
      (member) => member !== currentShop?._id
    );
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/messages/getAll/${currentChat?._id}`
        );
        if (data.msg) {
          console.log(data.msg);
        } else {
          setMessages(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, [currentChat]);

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    const message = {
      sender: currentShop?._id,
      text: newMessage,
      conversationId: currentChat?._id,
    };
    const receiverId = currentChat?.members.find(
      (member) => member !== currentShop?._id
    );
    socketId.emit("sendMessage", {
      senderId: currentShop?._id,
      receiverId,
      text: newMessage,
    });
    try {
      if (newMessage !== "") {
        const { data } = await axios.post(
          `${REACT_APP_BASE_URL}/messages/create`,
          message
        );
        if (data.msg) {
          console.log(data.msg);
        } else {
          setMessages([...messages, data]);
          updateLastMessage();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: currentShop?._id,
    });
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/conversation/updateLastMessage/${currentChat?._id}`,
        { lastMessage: newMessage, lastMessageId: currentShop?._id }
      );
      if (data.msg) {
        console.log(data.msg);
      } else {
        setNewMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const promise = storeFile(file);
    promise
      .then(async (url) => {
        setImages(url);
        imageSendHandler(url);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const storeFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading ${progress}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  const imageSendHandler = async (file) => {
    const receiverId = currentChat?.members.find(
      (member) => member !== currentShop?._id
    );
    socketId.emit("sendMessage", {
      senderId: currentShop?._id,
      receiverId,
      images: file,
    });
    const message = {
      sender: currentShop?._id,
      text: newMessage,
      images: file,
      conversationId: currentChat?._id,
    };
    try {
      const { data } = await axios.post(
        `${REACT_APP_BASE_URL}/messages/create`,
        message
      );
      if (data.msg) {
        console.log(data.msg);
      } else {
        console.log(data);
        setImages();
        setMessages([...messages, data]);
        updateLastMessageForImage();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateLastMessageForImage = async () => {
    try {
      const { data } = await axios.patch(
        `${REACT_APP_BASE_URL}/conversation/updateLastMessage/${currentChat?._id}`,
        { lastMessage: "photo", lastMessageId: currentShop?._id }
      );
      if (data.msg) {
        console.log(data.msg);
      } else {
        setNewMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ beahaviour: "smooth" });
  }, [messages]);
  return (
    <div className="w-[90%] bg-white shadow-sm m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-2xl py-3 ">All Messages </h1>
          {conversation?.map((convo, i) => (
            <MessageList
              setUserData={setUserData}
              convo={convo}
              key={i}
              index={i}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              shopId={currentShop?._id}
              userData={userData}
              online={onlineCheck(convo)}
              setActiveStatus={setActiveStatus}
            />
          ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          shopId={currentShop?._id}
          userData={userData}
          activeStatus={activeStatus}
          handleImageUpload={handleImageUpload}
          scrollRef={scrollRef}
        />
      )}
    </div>
  );
};

const MessageList = ({
  setUserData,
  convo,
  index,
  setOpen,
  setCurrentChat,
  shopId,
  userData,
  online,
  setActiveStatus,
}) => {
  const REACT_APP_BASE_URL = process.env.REACT_APP_BASE_URL;
  const [active, setActive] = useState(1);
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };
  useEffect(() => {
    const userId = convo.members.find((member) => member !== shopId);
    const getAll = async () => {
      try {
        const { data } = await axios.get(
          `${REACT_APP_BASE_URL}/users/get/${userId}`
        );
        if (data.msg) {
          console.log(data.msg);
        } else {
          setUser(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, [shopId, convo]);
  return (
    <div
      onClick={() =>
        setActive(index) ||
        handleClick(convo?._id) ||
        setCurrentChat(convo) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
      className={`w-full flex p-3 px-3 my-1 ${
        active === index ? "bg-slate-100" : "bg-gray-100"
      } cursor-pointer rounded-lg`}
    >
      <div className="relative">
        <img
          src={user?.avatar}
          alt="user"
          className="w-[50px] h-[50px] rounded-full"
        />
        {online && (
          <div className="w-[12px] h-[12px] bg-green-600 rounded-full absolute top-1 right-1"></div>
        )}
      </div>
      <div className="pl-3 ">
        <h1 className="text-lg">{user?.username}</h1>
        <p className="text-[15px] text-gray-700">
          {convo?.lastMessageId !== user?._id
            ? "You"
            : user.username.split(" ")[0]}
          {": " + convo?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  shopId,
  userData,
  activeStatus,
  handleImageUpload,
  scrollRef,
}) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      <div className="w-full flex p-3 shadow-sm items-center justify-between bg-slate-100">
        <div className="flex">
          <img
            src={userData?.avatar}
            alt="inbox"
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData?.username}</h1>
            <h1>{activeStatus ? "Active now" : "Offline"}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>
      <div className="px-3 h-[70vh]  py-3 overflow-y-scroll">
        {messages &&
          messages?.map((msg, i) => (
            <>
              <div
                className={`flex w-full my-2 ${
                  msg.sender === shopId ? "justify-end" : "justify-start"
                }`}
                ref={scrollRef}
              >
                <img
                  src={userData?.avatar}
                  alt="user"
                  className={`w-[40px] h-[40px] rounded-full mr-3 ${
                    msg.sender === shopId ? "hidden" : ""
                  }`}
                />

                <div>
                  <div
                    className={`w-max p-3 rounded-2xl h-min ${
                      msg.text !== ""
                        ? msg.sender === shopId
                          ? "bg-gray-200 text-black"
                          : "bg-slate-700 text-white"
                        : ""
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.images && (
                      <img
                        src={msg.images}
                        alt="img"
                        className="w-[300px] h-[300px] object-cover"
                      />
                    )}
                  </div>
                  <p className="text-sm text-gray-400 pt-1">
                    {format(msg.createdAt)}
                  </p>
                </div>
              </div>
            </>
          ))}
      </div>

      <form
        onSubmit={sendMessageHandler}
        className="p-3 w-full relative flex justify-between items-center"
      >
        <div className="w-[5%]">
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" />
          </label>
        </div>
        <div className="w-[95%]">
          <input
            type="text"
            placeholder="Enter message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={25}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default ShopMessages;

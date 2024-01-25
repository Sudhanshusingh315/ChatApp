import axios from "axios";
import { useEffect, useState } from "react";
function Chats() {
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const { data } = await axios.get("http://localhost:8080/api/chats");
    setChats(data);
  };
  useEffect(() => {
    fetchChats();
  }, []);
  return (
    <>
      {chats.map((chats) => (
        <div key={chats._id}>{chats.chatName}</div>
      ))}
    </>
  );
}

export default Chats;

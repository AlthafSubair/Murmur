import { useEffect, useRef } from "react"
import useGrpChatStore from "../store/useGrpChatStore"
import ChatHeader from "./ChatHeader"
import GrpMsgInput from "./GrpMsgInput"
import { useAuthStore } from "../store/useAuthStore"
import MessageSkeleton from "./MessageSkeleton"
import MessageInput from "./MessageInput"


const GrpChatContainer = () => {
  const {fetchMsges, grpChat, selectedGroup, isFetchingchat, realTimeGrpMsg, closeRealTimeGrpMsg} = useGrpChatStore()
const { authUser } = useAuthStore()
const messageEndRef = useRef<HTMLDivElement | null>(null);


function formatMessageTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

  
  useEffect(()=>{
    if(selectedGroup?._id){
      fetchMsges(selectedGroup?._id)
    }
    realTimeGrpMsg()

    return () => closeRealTimeGrpMsg()
  },[fetchMsges, selectedGroup?._id, realTimeGrpMsg, closeRealTimeGrpMsg ])

  useEffect(() => {
    if (messageEndRef.current && grpChat) {
      messageEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [grpChat]);
  
  if (isFetchingchat) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  console.log(grpChat)

  return (
    <div className="flex-1 flex flex-col overflow-auto">
    <ChatHeader />

    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {grpChat?.map((message) => (
        <div
          key={message._id}
          className={`chat ${message.senderId?._id === authUser?._id ? "chat-end" : "chat-start"}`}
          ref={messageEndRef}
        >
          <div className=" chat-image avatar">
            <div className="size-10 rounded-full border">
              <img
                src={
                  message.senderId?._id === authUser?._id
                    ? authUser?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    : message.senderId?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile pic"
              />
            </div>
          </div>
          <div className="chat-header mb-1">
            <time className="text-xs opacity-50 ml-1">
               {formatMessageTime(message?.createdAt)} 
            </time>
          </div>
          <div className="chat-bubble flex flex-col">
            {message?.image && (
              <img
                src={message?.image}
                alt="Attachment"
                className="sm:max-w-[200px] rounded-md mb-2"
              />
            )}
            {message.message && <p>{message.message}</p>}
          </div>
        </div>
      ))}
    </div>

   <GrpMsgInput /> 
  </div>
  )
}

export default GrpChatContainer
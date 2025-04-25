import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";
import { Link } from "react-router-dom";
import useGrpChatStore from "../store/useGrpChatStore";


const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { selectedGroup } = useGrpChatStore()

  return (
    <div className="p-2.5 border-b border-base-300">
     {selectedUser ?( <div className="flex items-center justify-between">
        <Link to={`/userinfo/${selectedUser?._id}`} className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={selectedUser?.username} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.username}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </Link>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>):
      (
        <div className="flex items-center justify-between">
        <Link to={`/groupinfo/${selectedGroup?._id}`} className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedGroup?.picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} alt={selectedGroup?.name} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedGroup?.name}</h3>
            <p className="text-sm text-base-content/70">
             
            </p>
          </div>
        </Link>

        {/* Close button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
      )}
    </div>
  );
};
export default ChatHeader;
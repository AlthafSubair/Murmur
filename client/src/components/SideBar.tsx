import { CircleUserRound, Component, PlusCircle, Users } from "lucide-react"
import useChatStore from "../store/useChatStore"
import { useEffect, useState } from "react"
import SideBarSkeleton from "./SideBarSkeleton"
import { useAuthStore } from "../store/useAuthStore"
import { Link } from "react-router-dom"
import useGrpChatStore from "../store/useGrpChatStore"

const SideBar = () => {

    const { isUsersLoading, selectedUser, setSelectedUser, getUsers, users} = useChatStore()

    const { fetchGrps, groups, selectedGroup, setSelectedGroup } = useGrpChatStore()
    const { authUser } = useAuthStore()

    const {onlineUsers} = useAuthStore() 
   
const [isGroups, setIsGroups] = useState(false)
useEffect(() => {
  if (!isGroups) {
    getUsers();
  } else if (authUser && authUser._id) {
    fetchGrps(authUser._id);
  }
}, [isGroups, getUsers, fetchGrps, authUser]);




 const [showOnlineOnly, setShowOnlineOnly] = useState(false)

 const filteredUsers = showOnlineOnly ? users.filter((user) => onlineUsers.includes(user._id)) : users

const handleisGrp = () =>{
  if(isGroups){
    setSelectedGroup(null)
  }else{
    setSelectedUser(null)
  }
  setIsGroups(!isGroups)
}

    if(isUsersLoading) return <SideBarSkeleton />

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
  { !isGroups ? (<div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center gap-2">
        <Users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>
     
      <div className="mt-3 hidden lg:flex items-center gap-2">
        <label className="cursor-pointer flex items-center gap-2">
           <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          /> *
          <span className="text-sm">Show online only</span>
        </label>
        <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
      </div>
    </div>):(
      <div className="border-b border-base-300 w-full p-5">
      <div className="flex items-center gap-2">
        <Component className="size-6" />
        <span className="font-medium hidden lg:block">Groups</span>
      </div></div>
    )}

<div className="border-b border-base-300 w-full p-5">
  <button
    onClick={handleisGrp}
    className="flex flex-row items-center gap-4 justify-center cursor-pointer"
  >
    {!isGroups ? (
      <>
        <div className="flex items-center">
          <div className="flex -space-x-3">
            {Array(3).fill(null).map((_, i) => (
              <CircleUserRound
                key={i}
                className="w-6 h-6 border-2 border-white rounded-full bg-gray-700"
              />
            ))}
          </div>
          <span className="ml-4">Groups</span>
        </div>
      </>
    ) : (
      <div className="flex items-center gap-2">
        <Users className="size-6" />
        <span className="font-medium hidden lg:block">Contacts</span>
      </div>
    )}
  </button>
</div>


   {isGroups && <div className="border-b border-base-300 w-full p-5">
    <Link to="create-group" className="flex flex-row items-center gap-2 justify-center cursor-pointer">
      <PlusCircle /> <span className="lg:flex hidden">Create a group</span>
    </Link>
    </div>}

    {!isGroups?(<div className="overflow-y-auto w-full py-3">
      {filteredUsers?.map((user) => (
        <button
          key={user._id}
          onClick={() => setSelectedUser(user)}
          className={`
            w-full p-3 flex items-center gap-3
            hover:bg-base-300 transition-colors
            ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
          `}
        >
          <div className="relative mx-auto lg:mx-0">
            <img
              src={user?.profilePicture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt={user?.username}
              className="size-12 object-cover rounded-full"
            />
           {onlineUsers.includes(user._id) && (
              <span
                className="absolute bottom-0 right-0 size-3 bg-green-500 
                rounded-full ring-2 ring-zinc-900"
              />
            )} 
          </div>

          {/* User info - only visible on larger screens */}
          <div className="hidden lg:block text-left min-w-0">
            <div className="font-medium truncate">{user?.username}</div>
            <div className="text-sm text-zinc-400">
               {onlineUsers.includes(user._id) ? "Online" : "Offline"} 
            </div>
          </div>
        </button>
      ))}

      {filteredUsers.length === 0 && (
        <div className="text-center text-zinc-500 py-4">No online users</div>
      )}
    </div>):(
    <div className="overflow-y-auto w-full py-3">
    {groups?.map((user) => (
      <button
        key={user._id}
        onClick={() => setSelectedGroup(user)}
        className={`
          w-full p-3 flex items-center gap-3
          hover:bg-base-300 transition-colors
          ${selectedGroup?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
        `}
      >
        <div className="relative mx-auto lg:mx-0">
          <img
            src={user?.picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
            alt={user?.name}
            className="size-12 object-cover rounded-full"
          />
         {onlineUsers.includes(user._id) && (
            <span
              className="absolute bottom-0 right-0 size-3 bg-green-500 
              rounded-full ring-2 ring-zinc-900"
            />
          )} 
        </div>

        {/* User info - only visible on larger screens */}
        <div className="hidden lg:block text-left min-w-0">
          <div className="font-medium truncate">{user?.name}</div>
         
        </div>
      </button>
    ))}

  
  </div>)
    }
  </aside>

  )
}

export default SideBar
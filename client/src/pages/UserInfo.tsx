import { Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import ProfileSkeleton from "../components/ProfileSkeleton";


const UserInfo = () => {
    const {userInfo, fetchUserInfo, userinfoLoading} = useAuthStore()

    const {id} = useParams()

    useEffect(()=>{
      if(id) fetchUserInfo(id)
    },[fetchUserInfo, id])

    if(userinfoLoading) return <ProfileSkeleton />

  return (
    <div className="h-full py-20">
    <div className="max-w-2xl mx-auto p-4 py-8">
      <div className="bg-base-300 rounded-xl p-6 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold ">Profile</h1>
        </div>

        {/* avatar upload section */}

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={userInfo?.profilePicture || "/avatar.png"}
              alt="Profile"
              className="size-32 rounded-full object-cover border-4 "
              onError={(e) => {
                e.currentTarget.onerror = null; // Prevent looping
                e.currentTarget.src = "/avatar.png";
              }}
            />
          
          </div>
        
        </div>

        <div className="space-y-6">
          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <User className="w-4 h-4" />
              Full Name
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userInfo?.username}</p>
          </div>

          <div className="space-y-1.5">
            <div className="text-sm text-zinc-400 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userInfo?.email}</p>
          </div>
        </div>

        <div className="mt-6 bg-base-300 rounded-xl p-6">
          <h2 className="text-lg font-medium  mb-4">Account Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
              <span>Member Since</span>
              <span>{userInfo?.createdAt?.split("T")[0]}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Status</span>
              <span className="text-green-500">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default UserInfo
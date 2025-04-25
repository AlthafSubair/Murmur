import {
  CopyPlus,
  DeleteIcon,
  Loader2,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import useGrpChatStore from "../store/useGrpChatStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import useChatStore from "../store/useChatStore";

const GroupInfo = () => {
  const { id } = useParams();

  const {
    isFetchingGrp,
    fetchGrpById,
    GroupInfo,
    isRemovingMember,
    removeMember,
    isAddingMember,
    addMember,
  } = useGrpChatStore();

  const { authUser } = useAuthStore();
  const { getUsers, users } = useChatStore();

  const [userId, setUserId] = useState("");
  const [isAddMember, setIsAddMember] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGrpById(id);
    }
  }, [id, fetchGrpById]);

  useEffect(() => {
    if (isAddMember) {
      getUsers();
    }
  }, [isAddMember, getUsers]);

  const handleAddMember = async (m_id: string) => {
    try {
      setUserId(m_id);
      if (GroupInfo?.createdBy?._id && id) {
        const data = {
          createdBy: authUser?._id,
          memberId: m_id,
        };
        const res = await addMember(id, data);
        if (res) {
          fetchGrpById(id);
          setIsAddMember(false);
          setUserId("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate()

  const handleDeleteMember = async (m_id: string) => {
    try {
      setUserId(m_id);
      if (GroupInfo?.createdBy?._id && id) {
        const payload = {
          createdBy: authUser?._id,
          memberId: m_id,
        };
        const res = await removeMember(id, payload);

        if (res.success) {

          if(res.msg === "Exited from group"){
            navigate('/')
          }else{
            fetchGrpById(id);
          }
          setUserId("");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const memberIds = GroupInfo?.members?.map((member) => member._id) || [];
  const filteredUsers = users.filter((user) => !memberIds.includes(user._id));

  if (isFetchingGrp) return <ProfileSkeleton />;

  return (
    <div className="h-full py-20">
      {isAddMember && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/30 z-50 flex justify-center items-center">
          <div className="max-w-2xl mx-auto p-4 py-8">
            <div className="bg-base-300 rounded-xl p-6 space-y-8 relative">
              <div className="absolute top-2 right-2">
                <button
                  onClick={() => setIsAddMember(false)}
                  className="btn btn-sm btn-ghost"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center pt-4">
                <h1 className="text-2xl font-semibold">Select Members</h1>
              </div>

              <div className="overflow-y-auto w-full py-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="w-full px-4 py-2 flex items-center gap-4 hover:bg-base-300 transition-colors duration-200"
                  >
                    <div className="relative">
                      <img
                        src={
                          user.profilePicture ||
                          "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt={user.username}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </div>

                    <div className="flex flex-col text-left min-w-0">
                      <span className="font-semibold truncate">
                        {user.username}
                      </span>
                    </div>

                    {GroupInfo?.createdBy?._id === authUser?._id &&
                      GroupInfo?.createdBy._id !== user._id && (
                        <div className="flex-1 flex justify-end">
                          <button
                            onClick={() => handleAddMember(user._id)}
                            disabled={isAddingMember}
                            className="btn btn-ghost btn-sm"
                          >
                            {isAddingMember && userId === user._id ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <UserPlus />
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={
                  GroupInfo?.picture ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Group
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {GroupInfo?.name}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <CopyPlus className="w-4 h-4" />
                Created By
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
                {GroupInfo?.createdBy?._id === authUser?._id
                  ? "You"
                  : GroupInfo?.createdBy?.username}
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between">
                <p className="flex text-sm text-zinc-400 items-center gap-2">
                  <Users className="w-4 h-4" />
                  Members
                </p>
                <p className="flex text-sm text-zinc-400 items-center">
                  {GroupInfo?.count} members
                </p>
              </div>

              <div className="overflow-y-auto w-full py-3">
                {GroupInfo?.members
                  ?.slice()
                  .sort((a, b) => {
                    if (a._id === authUser?._id) return -1;
                    if (b._id === authUser?._id) return 1;
                    return 0;
                  })
                  ?.map((user) => (
                    <div
                      key={user._id}
                      className="w-full px-4 py-2 flex items-center gap-4 hover:bg-base-300 transition-colors duration-200"
                    >
                      <div className="relative">
                        <img
                          src={
                            user.profilePicture ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                          }
                          alt={user.username}
                          className="w-12 h-12 object-cover rounded-full"
                        />
                      </div>

                      <div className="flex flex-col text-left min-w-0">
                        <span className="font-semibold truncate">
                          {authUser?._id === user._id ? "You" : user.username}
                        </span>
                        <span className="text-sm text-gray-400 truncate">
                          {GroupInfo?.createdBy?._id === user._id
                            ? "Admin"
                            : "Member"}
                        </span>
                      </div>

                      {GroupInfo?.createdBy?._id === authUser?._id &&
                        GroupInfo.createdBy._id !== user._id && (
                          <div className="flex-1 flex justify-end">
                            <button
                              onClick={() => handleDeleteMember(user._id)}
                              disabled={isRemovingMember}
                              className="btn btn-ghost btn-sm"
                            >
                              {isRemovingMember && userId === user._id ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <DeleteIcon />
                              )}
                            </button>
                          </div>
                        )}

                      {GroupInfo?.createdBy?._id !== authUser?._id &&
                        user._id === authUser?._id && (
                          <div className="flex-1 flex justify-end">
                            <button
                              onClick={() => handleDeleteMember(user._id)}
                              disabled={isRemovingMember}
                              className="btn btn-ghost btn-sm"
                            >
                              Exit
                            </button>
                          </div>
                        )}
                    </div>
                  ))}

                {GroupInfo?.createdBy?._id === authUser?._id && (
                  <button
                    onClick={() => setIsAddMember(true)}
                    className="btn btn-primary w-full mt-8"
                  >
                    Add Members
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Group Since</span>
                <span>{GroupInfo?.createdAt?.split("T")[0]}</span>
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
  );
};

export default GroupInfo;

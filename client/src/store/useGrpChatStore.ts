import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";
import axiosInstance from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface CustomErrorResponse {
    errors: { msg: string }[];
    message?: string;
  }

  interface group{
    _id: string;
    name: string;
    createdBy: string;
    picture: string;
    members: string[]
    createdAt: string;
  }

  interface members {
    _id: string;
    username: string;
    profilePicture: string;
  }

  interface createdByType {
    _id: string;
    username: string;
    profilePicture: string;
  }

  interface groupinfo{
    _id: string;
    name: string;
    createdBy: createdByType;
    picture: string;
    members: members[]
    createdAt: string;
    count: number;
  }

interface GrpChatState {
    isGrpCreating: boolean;
    isFetchingGrp: boolean
    groups: group[];
    grpChat: ChatMessage[];
    selectedGroup: group | null;
    GroupInfo: groupinfo | null;
    isRemovingMember: boolean;
    isAddingMember: boolean;
    isFetchingchat: boolean;
    createGroup: (id: string, formData: FormData) => Promise<boolean>;
    fetchGrps: (id: string) => Promise<void>;
    setSelectedGroup: (group: group | null) => void;
    fetchGrpById: (id: string) => Promise<void>;
    removeMember: (id: string, data: MemberDataType) => Promise<{ success: boolean; msg?: string }>;
    addMember: (id: string, data: MemberDataType) => Promise<boolean>;
    sendGrpMessage: (message: FormData) => Promise<void>;
    fetchMsges: (id: string) => Promise<void>;
    realTimeGrpMsg: () => void;
    closeRealTimeGrpMsg: () => void;
}

interface MemberDataType{
  createdBy: string | undefined;
  memberId: string;
}

interface senderType {
  _id: string;
  username: string;
  profilePicture: string;
}

export interface ChatMessage {
  _id: string;
  senderId: senderType;
  reciverId: string;
  image?: string;
  message: string;
  createdAt: string;
}

const useGrpChatStore = create<GrpChatState>((set, get) => ({
    isGrpCreating: false,
    selectedGroup: null,
    isFetchingGrp: false,
    isFetchingchat: false,
    isRemovingMember: false,
    isAddingMember: false,
    grpChat: [],
    groups: [],
    GroupInfo: null,

    createGroup: async(id: string, formData: FormData) => {
        try {
            set({isGrpCreating: true})

            const res = await axiosInstance.post(`/group/create/${id}`, formData)

            if(res.status === 201){
                toast.success("Group created successfully")
                return true
            }
            toast.error("Unexpected response while creating group");
            return false
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError<CustomErrorResponse>;
                const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
                toast.error(errorMsg || "Error in fetching userinfo");
              } else {
                toast.error("Error in fetching userinfo");
              }
              return false
        }finally{
            set({isGrpCreating: false})
        }
    },

    fetchGrps: async (id: string) => {
        try {
          
            const res = await axiosInstance.get(`/group/${id}`)
            console.log(res)
            if(res.status === 200){
                set({groups: res.data})
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError<CustomErrorResponse>;
                const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
                toast.error(errorMsg || "Error in fetching groups");
              } else {
                toast.error("Error in fetching groups");
              }
            }
    },
    setSelectedGroup: (group: group | null) => set({selectedGroup: group}),

    fetchGrpById: async (id: string) => {
      try {
        set({isFetchingGrp: true})
        const res = await axiosInstance.get(`/group/grp/${id}`)
        if(res.status === 200){
          set({GroupInfo: res.data})
        }
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError<CustomErrorResponse>;
          const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
          toast.error(errorMsg || "Error in fetching group details");
        } else {
          toast.error("Error in fetching group details");
        }
      }finally{
        set({isFetchingGrp: false})
      }
    },
    removeMember: async (id: string, data: MemberDataType): Promise<{ success: boolean; msg?: string }> => {
      try {
        set({ isRemovingMember: true });
    
        const res = await axiosInstance.delete(`/group/member/${id}`, {
          data: data
        });
    
        if (res.status === 200) {
          toast.success(res.data.message);
          return { success: true, msg: res.data.message };
        }
    
        return { success: false };
    
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError<CustomErrorResponse>;
          const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
          toast.error(errorMsg || "Error in removing member");
        } else {
          toast.error("Error in removing member");
        }
    
        return { success: false };
      } finally {
        set({ isRemovingMember: false });
      }
    },
    

    addMember: async (id: string, data: MemberDataType) => {
      try {
set({isAddingMember: true})

        const res = await axiosInstance.patch(`/group/member/${id}`, data);

        // Optional: handle success
        console.log(res)

       if(res.status === 200){
        set({GroupInfo: res.data})
        toast.success("Member added successfully");
        return true
       }else{
        toast.error("Unexpected response while adding member");
        return false
       }
        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError<CustomErrorResponse>;
          const errorMsg =
            err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg ||
            err.response?.data?.message;
          toast.error(errorMsg || "Error in removing member");
        } else {
          toast.error("Error in removing member");
        }
        return false
      }finally{
        set({isAddingMember: false})
      }
    },
    sendGrpMessage: async (message: FormData) => {
      try {
       
        console.log(message)
          const { grpChat, selectedGroup } = get();
          const { data } = await axiosInstance.post(`/group/message/${selectedGroup?._id}`, message,
            {
              headers: { "Content-Type": "multipart/form-data" },
          });
          set({ grpChat: [...grpChat, data] }); // ✅ fixed typo
      } catch (error) {
          console.error(error);
          toast.error('Failed to send message');
      }
  },

  fetchMsges: async (id: string) => {
    try {
    
      const res = await axiosInstance.get(`/group/message/${id}`)
      if(res.status === 200){
        set({grpChat: res.data})
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in fetching messages");
      } else {
        toast.error("Error in fetching messages");
      }
    }
  },

  realTimeGrpMsg: () => {
    const { selectedGroup } = get();
    if (!selectedGroup) return;

    const socket = useAuthStore.getState().socket;

    // Ensure the event listener is added only once
    socket?.off("grpMsg"); // Remove any previous listeners before adding a new one
    socket?.on("grpMsg", (populatedMessage) => {
    

        set({ grpChat: [...get().grpChat, populatedMessage] });
    });
},

closeRealTimeGrpMsg: () => {
    const socket = useAuthStore.getState().socket;
    // Remove the grpMsg listener
    socket?.off("grpMsg");
}

  

    
    
}))

export default useGrpChatStore;
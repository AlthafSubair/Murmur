import { create } from 'zustand'
import axiosInstance from '../lib/axios'
import toast from 'react-hot-toast'

interface userType{
    _id: string,
    username: string,
    profilePicture: string,
}

export interface ChatMessage {
    _id: string;
    senderId: string;
    reciverId: string;
    image?: string;
    message: string;
    createdAt: string;
  }
  

interface chatDataType{
 users: userType[],
 isUsersLoading: boolean,
 isMessagesLoading: boolean,
 selectedUser: userType | null,
 messages: ChatMessage[] ,
 getUsers: () => void,
 getMessages: (userId: string) => void,
 setSelectedUser: (user: userType) => void,
 sendMessage: (message: FormData) => void
}
const useChatStore = create<chatDataType>((set, get) => ({
    messages: [], // ✅ fixed typo
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const { data } = await axiosInstance.get('message/users');
            set({ users: data });
            console.log(data);
        } catch (error) {
            console.error(error);
            toast.error('Error while fetching users');
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId: string) => {
        set({ isMessagesLoading: true });
        try {
            const { data } = await axiosInstance.get(`/message/${userId}`);
            console.log(data);
            set({ messages: data }); // ✅ fixed typo
        } catch (error) {
            console.error(error);
            toast.error('Error while fetching messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    setSelectedUser: (user: userType) => {
        set({ selectedUser: user });
    },

    sendMessage: async (message: FormData) => {
        try {
            const { messages, selectedUser } = get();
            const { data } = await axiosInstance.post(`/message/${selectedUser?._id}`, message);
            set({ messages: [...messages, data] }); // ✅ fixed typo
        } catch (error) {
            console.error(error);
            toast.error('Failed to send message');
        }
    }
}));
export default useChatStore;
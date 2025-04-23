import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { io } from "socket.io-client";
import { Socket } from "socket.io-client";


interface AuthUser {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  profilePicture: string;
  createdAt: string;
}

interface signupData {
  username: string;
  email: string;
  password: string;
}

interface loginData {
  email: string;
  password: string;
}

interface otpData {
  otp: string;
  path: string | null;
}

interface resetPasswordData {
  password: string;
  confirmPassword: string;
}

interface AuthState {
  authUser: AuthUser | null;
  isSigningUp: boolean;
  isLogingin: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  isOtpResending: boolean;
  isVerifyingOtp: boolean;
  isResetingPassword: boolean;
  isLoggingOut: boolean;
  email: string;
  socket: Socket | null;
  onlineUsers: string[];
  userInfo: AuthUser | null;
  userinfoLoading: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: signupData) => Promise<boolean>;
  resendOtp: (path: string) => Promise<boolean>;
  verifyOtp: (data: otpData) => Promise<boolean>;
  logIn: (data: loginData) => Promise<{ success: boolean; requiresVerification?: boolean }>;
  setEmail: (email: string) => void;
  resetPassword: (data: resetPasswordData, email: string) => Promise<boolean>;
  googleAuth: (token: string) => Promise<void>;
  logOutUser: () => Promise<void>;
  updateProfile: (data: FormData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  fetchUserInfo: (userId: string) => Promise<void>;
}


interface CustomErrorResponse {
  errors: { msg: string }[];
  message?: string;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLogingin: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  isOtpResending: false,
  isVerifyingOtp: false,
  isLoggingOut: false,
  onlineUsers: [],
  isResetingPassword: false,
  email: "",
  socket: null,
  userInfo: null,
  userinfoLoading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
      get().connectSocket()
    } catch (error) {
      console.log("error in checking Auth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data: signupData) => {
    set({ isSigningUp: true });
    set({ email: data.email });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      
      if (res.data.errors && res.data.errors.length > 0) {
        console.log("Validation errors:", res.data.errors);
        toast.error(res.data.errors[0]?.msg || "Error in creating account");
        set({ email: "" });
        return false;
      }

      console.log("res in signup:", res.data.message || "Account created successfully");
      toast.success("Account created successfully");
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in creating account");
      } else {
        toast.error("Error in creating account");
      }
      set({ email: "" });
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  resendOtp: async (path: string) => {
    set({ isOtpResending: true });
    try {
      const res = await axiosInstance.post(`/auth/resend-otp/?path=${path}`, { 
        email: useAuthStore.getState().email 
      });

      if (res.data.message) {
        toast.success(res.data.message);
        return true
      }
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in sending otp");
      } else {
        toast.error("Error in sending otp");
      }
      return false;
    } finally {
      set({ isOtpResending: false });
    }
  },

  verifyOtp: async (data: otpData) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axiosInstance.post(
        `/auth/verify-otp/?path=${data.path}`,
        { 
          email: useAuthStore.getState().email, 
          otp: Number(data.otp) 
        }
      );
      
      if (res.data.message) {
        toast.success(res.data.message);
      }
      
      // If verification is successful, update authUser if available
      if (res.data.data) {
        set({ authUser: res.data.data });
      }
      
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in verifying otp");
      } else {
        toast.error("Error in verifying otp");
      }
      set({ email: "" });
      return false;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  logIn: async (data: loginData) => {
    set({ isLogingin: true });
    set({ email: data.email });
    
    try {
      const res = await axiosInstance.post("/auth/login", data);
      
      if (!res.data.data.isVerified) {
        // Store the email for verification purposes
        set({ email: data.email });
        toast.error("Please verify your account")
        get().connectSocket()
        return { 
          success: false, 
          requiresVerification: true 
        };
      }
      toast.success("Logged in successfully");
      // If verified, set the user
      set({ authUser: res.data.data });
      return { success: true };
      
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || 
                        err.response?.data?.message ||
                        "Error in logging in";
        toast.error(errorMsg);
      } else {
        toast.error("Error in logging in");
      }
      return { success: false };
    } finally {
      set({ isLogingin: false });
    }
  },

  setEmail: (email: string) => {
    set({ email });
  },

  resetPassword: async (data: resetPasswordData, email: string) => {
    set({ isResetingPassword: true });
    try {
      const res = await axiosInstance.post("/auth/reset-password", { ...data, email });

      if (res.data.message) {
        toast.success(res.data.message);
        return true;
      }
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in resetting password");
      }else{
        toast.error("Error in resetting password");
      }
      return false;
    }finally{
      set({ isResetingPassword: false });
    }
  },

  googleAuth: (code: string) => axiosInstance.get(`/auth/google?code=${code}`),
 
  logOutUser: async () => {
    set({ isLoggingOut: true });
    try {
      const res = await axiosInstance.post("/auth/logout");
      if (res.data.message) {
        toast.success(res.data.message);
      }
      set({ authUser: null });
      get().disconnectSocket()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in logging out");
      } else {
        toast.error("Error in logging out");
      }
    }finally{
      set({ isLoggingOut: false });
    }
  },
  updateProfile: async (data: FormData) => {
    try {
      set({ isUpdatingProfile: true });

      const res = await axiosInstance.put("/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.message) {
        toast.success(res.data.message);
      }

      set((state) => ({
        authUser: {
          ...state.authUser,
          ...res.data.data, // Make sure your backend returns `data` with updated user
        },
      }));
      

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in updating profile");
      } else {
        toast.error("Error in updating profile");
      }
      
    }finally{
      set({ isUpdatingProfile: false });
    }
  },

  fetchUserInfo: async (userId: string) => {
    try {
      set({ userinfoLoading: true });

      const res = await axiosInstance.get(`/auth/profile/${userId}`);

      set({ userInfo: res.data.data });
      
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const err = error as AxiosError<CustomErrorResponse>;
        const errorMsg = err.response?.data?.errors?.[err.response?.data?.errors?.length - 1]?.msg || err.response?.data?.message;
        toast.error(errorMsg || "Error in fetching userinfo");
      } else {
        toast.error("Error in fetching userinfo");
      }
    }finally{
      set({ userinfoLoading: false})
    }
  },

  connectSocket: () => {

    const { authUser } = get();


    if (!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_SERVER_URI, {
      query: {
        userId: authUser._id,
      }
    })
    socket.connect()

    set({ socket: socket });

    socket.on("onlineUsers", (users) =>{
      set({ onlineUsers: users })
    })

  },

  disconnectSocket: () => {
    if (get().socket?.connected) get()?.socket?.disconnect();
  }

}));
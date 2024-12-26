import AsyncStorage from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "../utils/Storage";

// // TODO: Add user type
// type User = LoginSuccessResponse["data"];
export interface USER2 {
  token: string;
  user: User;
}
export interface imageColors {
  background: string;
  detail: string;
  platform: string;
  primary: string;
  secondary: string;
}
export interface User {
  created_at: Date;
  description: null;
  id: number;
  updated_at: Date;
  user_type: string;
  username: string;
}

export const HACKER_URL = "https://099b-105-160-38-88.ngrok-free.app/api/";
export interface GetStreamUserDetails {
  token: string;
  email: string;
  client_id: any;
  name: string;
}
export interface locationMini {
  latitude: any;
  longitude: any;
}
export interface VeeUser {
  name: string;
  phone: string;
  userId: string;
  profile: any;
}
interface UserStore {
  canAccessDashboard: boolean;
  setCanAccessDashboard: (canAccessDashboard: boolean) => void;
  user: VeeUser;
  setUser: (user: VeeUser | any) => void;
  onboarded: boolean;
  setOnboarded: (onboarded: boolean) => void;
  userId: any;
  setUserId: (userId: any) => void;
  phone: any;
  setPhone: (phone: any) => void;
  sessionExpiresIn: any;
  setSessionExpiresIn: (sessionExpiresIn: any) => void;
  dialCode: any;
  setDialCode: (dialCode: any) => void;
}

export const userStore = create(
  persist<UserStore>(
    (set, get) => ({
      canAccessDashboard: false,
      setCanAccessDashboard: (canAccessDashboard: boolean) => {
        set({ canAccessDashboard });
      },
      user: null,
      setUser: (user: any) => {
        set({ user });
      },
      onboarded: false,
      setOnboarded: (onboarded: boolean) => {
        set({ onboarded });
      },
      userId: null,
      setUserId: (userId: any) => {
        set({ userId });
      },
      phone: null,
      setPhone: (phone: any) => {
        set({ phone });
      },
      sessionExpiresIn: null,
      setSessionExpiresIn: (sessionExpiresIn: any) => {
        set({ sessionExpiresIn });
      },
      dialCode: null,
      setDialCode: (dialCode: any) => {
        set({ dialCode });
      },
    }),
    {
      name: "user",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);

export default userStore;

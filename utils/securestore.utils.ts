import * as SecureStore from "expo-secure-store";

export const getToken = async () => {
  const sessionInfo: any = await SecureStore.getItemAsync("auth-storage");
  console.log(sessionInfo, "session info");

  if (sessionInfo) {
    console.log(sessionInfo);
    return JSON.parse(sessionInfo)?.state.token || null;
  }
};
export const getTokenAsync = async () => {};

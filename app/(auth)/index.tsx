import userStore from "@/store/user.store";
import { CommonActions } from "@react-navigation/native";
import {
  Redirect,
  router,
  useNavigation,
  useNavigationContainerRef,
  useRootNavigation,
  useRootNavigationState,
} from "expo-router";
import React, { useEffect } from "react";

/* 
    This route is used for authentication purposes.
    It is the first route that is rendered when the app is opened because it is the first index page in the app stack.
    The recommended way to perform authentication is at: https://docs.expo.dev/router/reference/authentication/ but there is a bug
    in that approach that is reported here: https://github.com/expo/expo/issues/26411 so we are using this approach instead.
*/

export default function AuthManager() {
  const { onboarded, phone, userId, canAccessDashboard } = userStore(
    (state) => state
  );
  const navigation = useNavigationContainerRef();
  const rootNavigationState = useRootNavigationState();
  const navigatorReady = rootNavigationState?.key != null;

  useEffect(() => {
    if (navigatorReady && navigation) {
      if (!canAccessDashboard) {
        router.dismissAll();

        router.replace("/(auth)/landing");
      } else {
        router.dismissAll();
        router.replace("/(tabs)/home/");
      }
    }
  }, [navigatorReady]);

  if (canAccessDashboard) {
    return <Redirect href={"/(tabs)/home/"} />;
  } else {
    return <Redirect href={"/(auth)/landing"} />;
  }
}

import userStore from "@/store/user.store";
import {
  Redirect,
  router,
  useFocusEffect,
  useRootNavigationState,
} from "expo-router";
import React, { useCallback, useEffect } from "react";

/* 
    This route is used for authentication purposes.
    It is the first route that is rendered when the app is opened because it is the first index page in the app stack.
    The recommended way to perform authentication is at: https://docs.expo.dev/router/reference/authentication/ but there is a bug
    in that approach that is reported here: https://github.com/expo/expo/issues/26411 so we are using this approach instead.
*/

export default function AuthManager() {
  const { onboarded, user, canAccessDashboard } = userStore((state) => state);
  const rootNavigationState = useRootNavigationState();
  const navigatorReady = rootNavigationState?.key != null;

  if (!user && !canAccessDashboard) {
    return <Redirect href="/(auth)/landing" />;
  } else if (canAccessDashboard && user) {
    return <Redirect href={"/(tabs)/home"} />;
  }
}

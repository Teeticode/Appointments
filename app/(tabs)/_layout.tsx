import React, { useCallback } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Link,
  router,
  Tabs,
  useFocusEffect,
  useNavigationContainerRef,
  useRootNavigationState,
} from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import userStore from "@/store/user.store";
import { StackActions } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { canAccessDashboard } = userStore();
  const rootNavigation = useNavigationContainerRef();
  const rootNavigationState = useRootNavigationState();
  const navigatorReady = rootNavigationState?.key != null;
  useFocusEffect(
    useCallback(() => {
      console.log("tabs");
      if (router && !canAccessDashboard && navigatorReady) {
        //rootNavigation.dispatch(StackActions.popToTop());
        router.replace("/(auth)/landing");
        //router.dismissAll();
      }
    }, [router])
  );
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.theme.brownish,

        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          height: 65,
          borderRadius: 40,
          marginHorizontal: 8,
          bottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <AntDesign
              style={{ marginTop: 10 }}
              name="home"
              color={color}
              size={moderateScale(30)}
            />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <Feather
              style={{ marginTop: 10 }}
              name="settings"
              color={color}
              size={moderateScale(30)}
            />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

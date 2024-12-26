import { StyleSheet } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import MainButton from "@/components/MainButton";
import MainText from "@/components/MainText";
import userStore from "@/store/user.store";
import { AppWriteAccount } from "@/utils/app.write";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MainProfileScreen from "@/Screens/profile/MainProfileScreen";
import { height, width } from "../(auth)/landing";

export default function TabTwoScreen() {
  const { setCanAccessDashboard, setUser } = userStore();
  return (
    <SafeAreaView style={{ width: width, height: height }}>
      <MainProfileScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

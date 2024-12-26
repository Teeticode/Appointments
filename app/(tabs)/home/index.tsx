import { StyleSheet, Text, View } from "react-native";
import React, { Suspense } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MainHomeScreen from "@/Screens/home/MainHomeScreen";

type Props = {};

const MainHome = (props: Props) => {
  return (
    <Suspense>
      <SafeAreaView style={styles.container}>
        <MainHomeScreen />
      </SafeAreaView>
    </Suspense>
  );
};

export default MainHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

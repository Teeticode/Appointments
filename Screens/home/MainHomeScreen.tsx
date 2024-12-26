import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Box from "@/components/Box";
import TaskCalendar from "../components/TaskCalendar";
import { useNavigation } from "expo-router";
import { height, width } from "@/app/(auth)/landing";
import FAB from "../components/FAB";

type Props = {};

const MainHomeScreen = (props: Props) => {
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  return (
    <Box width={width} height={height}>
      <TaskCalendar refresh={refresh} setRefresh={setRefresh} />

      <FAB setRefresh={setRefresh} refresh={refresh} />
    </Box>
  );
};

export default MainHomeScreen;

const styles = StyleSheet.create({});

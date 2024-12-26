import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Box from "@/components/Box";
import CreateTaskCalendar from "@/Screens/components/CreateTaskCalendar";
import { useNavigation } from "expo-router";
import { height, width } from "@/app/(auth)/landing";

type Props = {};

const CreateTask = (props: Props) => {
  const navigation = useNavigation();
  return (
    <Box width={width} height={height}>
      <CreateTaskCalendar navigation={navigation} />
    </Box>
  );
};

export default CreateTask;

const styles = StyleSheet.create({});

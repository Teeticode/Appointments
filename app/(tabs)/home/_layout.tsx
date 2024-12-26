import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

type Props = {};

const HomeStackLayout = () => {
  return (
    <Stack
      screenOptions={{
        // title: "Home",
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "vertical",
        animation: "slide_from_right",
        animationDuration: 3000,
      }}
    />
  );
};

const HomeLayout = (props: Props) => {
  return <HomeStackLayout />;
};

export default HomeLayout;

const styles = StyleSheet.create({});

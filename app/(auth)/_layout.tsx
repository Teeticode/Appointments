import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

type Props = {};

const AuthStackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: "vertical",
      }}
    />
  );
};

const AuthLayout = (props: Props) => {
  return <AuthStackLayout />;
};

export default AuthLayout;

const styles = StyleSheet.create({});

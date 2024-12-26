import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React from "react";
import Box from "./Box";
import { Ionicons } from "@expo/vector-icons";
import Icon from "./Icon";
import MainText from "./MainText";
import { moderateScale } from "react-native-size-matters";
import MainButton from "./MainButton";
import { router } from "expo-router";

type Props = {
  create?: boolean;
};

const BackHeader = ({ create }: Props) => {
  const colorScheme = useColorScheme();
  return (
    <MainButton
      color="transparent"
      width={moderateScale(50)}
      ma={5}
      direction="row"
      onPress={() => router.back()}
      align="center"
    >
      <Box direction="row" align="center">
        {create ? (
          <Icon
            color={"#fff"}
            source="Entypo"
            name={"chevron-left"}
            size={moderateScale(35)}
          />
        ) : (
          <Icon
            color={colorScheme === "dark" ? "#fff" : "#000"}
            source="Entypo"
            name={"chevron-left"}
            size={moderateScale(35)}
          />
        )}
        {create ? (
          <MainText color={"#fff"} size={"md"}>
            Back
          </MainText>
        ) : (
          <MainText size={"md"}>Back</MainText>
        )}
      </Box>
    </MainButton>
  );
};

export default BackHeader;

const styles = StyleSheet.create({});

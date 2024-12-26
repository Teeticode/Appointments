import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import MainText from "@/components/MainText";
import Box from "@/components/Box";
import MainButton from "@/components/MainButton";
import Colors from "@/constants/Colors";
import { router } from "expo-router";

type Props = {};
export const { width, height } = Dimensions.get("screen");

const LandingAuth = (props: Props) => {
  return (
    <Box width={width} height={height}>
      <ImageBackground
        style={styles.cover}
        resizeMode="stretch"
        blurRadius={0}
        source={require("@/assets/bg/bg.png")}
      >
        <Box position="absolute" bottom={80} width={width} align="center">
          <MainButton
            color={Colors.theme.pink}
            height={60}
            pa={10}
            onPress={() => {
              router.push("/(auth)/signin");
            }}
            width={width * 0.85}
          >
            <MainText isHeading={true} color={"#fff"}>
              Get Started 🥳
            </MainText>
          </MainButton>
          {/* <MainButton
            height={60}
            color={Colors.theme.brownish}
            mt={10}
            pa={10}
            width={width * 0.85}
            onPress={() => {
              router.push("/(auth)/signin");
            }}
          >
            <MainText isHeading={true} color={"#fff"}>
              Login
            </MainText>
          </MainButton> */}
        </Box>
      </ImageBackground>
    </Box>
  );
};

export default LandingAuth;

const styles = StyleSheet.create({
  cover: {
    width: width,
    height: height,
    resizeMode: "cover",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

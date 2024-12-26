import React, { useRef } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { TLoading } from "./types";
import { typography } from "@/utils/typography";
import MainText from "../MainText";
import LottieView from "lottie-react-native";
import notfound from "@/assets/animation/404.json";
import Box from "../Box";

const ListEmpty = ({ loading, selectedDate }: TLoading) => {
  const label = !selectedDate ? "Pick a day" : "No events";
  const animationRef = useRef<LottieView>(null);
  if (loading) {
    return null;
  }

  return !loading || !selectedDate ? (
    <Animated.View entering={FadeInDown} style={styles.container}>
      <Box align="center">
        <LottieView
          //duration={5000}
          autoPlay
          ref={animationRef}
          resizeMode="cover"
          style={{
            width: 120,
            height: 120,
            marginHorizontal: 10,
            padding: 5,

            //   backgroundColor: Colors.theme.lightPink,
          }}
          source={notfound}
        />
      </Box>
      <MainText isHeading>No Appointments Found</MainText>
    </Animated.View>
  ) : null;
};

export default ListEmpty;

const styles = StyleSheet.create({
  container: {
    marginTop: 64,
    alignSelf: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    fontFamily: typography.medium,
    //color: "white",
  },
});

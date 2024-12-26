import React from "react";
import { BlurView } from "expo-blur";

import Loader from "./Loader";
import { Modal, StyleSheet } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { height, width } from "@/app/(auth)/landing";
import { Overlay } from "@rneui/themed";

type Props = {
  open: boolean;
  description?: string;
};

const LoaderOverlay = (props: Props) => {
  return (
    <Overlay
      isVisible={props.open}
      statusBarTranslucent
      overlayStyle={{
        backgroundColor: "transparent",
      }}
    >
      <BlurView style={styles.blurView} tint="default" intensity={20}>
        <Loader size={moderateScale(150)} />
      </BlurView>
    </Overlay>
  );
};

export default LoaderOverlay;
const styles = StyleSheet.create({
  card: {
    borderRadius: moderateScale(20),
    height: moderateScale(300),
    width: moderateScale(300),
    alignItems: "center",
    justifyContent: "center",
  },
  blurView: {
    width: width,
    height: height,
    justifyContent: "center",
    alignItems: "center",
  },
});

import { StyleProp, StyleSheet, ViewStyle, Platform } from "react-native";
import React, { useCallback, useMemo, useRef, Ref } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { moderateScale } from "react-native-size-matters";
import Animated from "react-native-reanimated";

type Props = {
  sheetRef?: Ref<BottomSheetMethods>;
  snapPoints?: string[];
  index?: number;
  handleIndicatorStyle?: object;
  backgroundStyle?: StyleProp<
    Omit<ViewStyle, "left" | "right" | "position" | "top" | "bottom">
  >;
  style?: StyleProp<
    Animated.AnimateStyle<
      Omit<
        ViewStyle,
        | "left"
        | "right"
        | "position"
        | "top"
        | "bottom"
        | "opacity"
        | "flexDirection"
        | "transform"
      >
    >
  >;
  children: React.ReactNode;
  enablePanDown?: boolean;
  intensity?: number; // Added for customizable glass effect
  darkMode?: boolean; // Added for theme control
};

const MainBottomSheet = ({
  sheetRef: propSheetRef,
  snapPoints = ["50%", "70%"],
  index = -1,
  handleIndicatorStyle = { width: moderateScale(66) },
  backgroundStyle,
  style = { justifyContent: "flex-start" },
  children,
  enablePanDown,
  intensity = 0.8,
  darkMode = true,
}: Props) => {
  const sheetRef = useRef<BottomSheetMethods | null>(null);

  const handleSheetChange = useCallback((currentIndex: number) => {
    // Handle sheet change if needed
  }, []);

  const localSheetRef = propSheetRef || sheetRef;

  const glassStyles = useMemo(
    () => ({
      backgroundColor: darkMode
        ? `rgba(40, 40, 40, ${intensity})`
        : `rgba(255, 255, 255, ${intensity})`,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          backdropFilter: "blur(10px)",
        },
        android: {
          elevation: 5,
        },
      }),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      ...StyleSheet.flatten(backgroundStyle),
    }),
    [intensity, darkMode, backgroundStyle]
  );

  const renderBottomSheet = useMemo(
    () => (
      <BottomSheet
        ref={localSheetRef}
        index={index}
        enablePanDownToClose={enablePanDown ?? true}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        handleIndicatorStyle={{
          backgroundColor: darkMode ? "#ffffff50" : "#00000050",
          width: moderateScale(66),
          ...handleIndicatorStyle,
        }}
        backgroundStyle={glassStyles}
        style={style}
      >
        {children}
      </BottomSheet>
    ),
    [
      localSheetRef,
      index,
      snapPoints,
      handleSheetChange,
      handleIndicatorStyle,
      glassStyles,
      style,
      children,
    ]
  );

  return renderBottomSheet;
};

export default MainBottomSheet;

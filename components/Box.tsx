import { AnimatePresence, MotiView } from "moti";
import React, { ReactNode, useEffect, useState } from "react";
import {
  DimensionValue,
  FlexStyle,
  Platform,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

export default function Box({
  viewProps,
  style,
  children,
  block = false,
  direction = "column",
  gap,
  alignSelf,
  align,
  justify,
  borderColor = "transparent",
  borderTopWidth,
  borderBottomWidth,
  borderRightWidth,
  borderLeftWidth,
  borderWidth = 0,
  px,
  py,
  pa,
  mx,
  my,
  ma,
  pt,
  pb,
  pl,
  pr,
  mt,
  mb,
  ml,
  mr,
  width,
  height = "auto",
  color = "transparent",
  radius = 0,
  radiusTop,
  radiusBottom,
  flex,
  wrap,
  position,
  top,
  bottom,
  left,
  right,
  overflow,
  animated = false,
  opacity = 1,
  pointerEvents,
}: BoxProps) {
  return (
    <View
      pointerEvents={pointerEvents ? pointerEvents : "auto"}
      style={{
        flexDirection: direction,
        flexWrap: wrap,
        alignSelf,
        gap,
        alignItems: align,
        justifyContent: justify,
        width: width ? width : block ? "100%" : "auto",
        height: height,
        padding: pa,
        paddingHorizontal: px,
        paddingVertical: py,
        paddingLeft: pl,
        paddingRight: pr,
        paddingTop: pt,
        paddingBottom: pb,
        margin: ma,
        marginHorizontal: ma ? ma : mx,
        marginVertical: ma ? ma : my,
        marginLeft: ml,
        marginRight: mr,
        marginTop: mt,
        marginBottom: mb,
        backgroundColor: color,
        borderRadius: radius,
        borderColor,
        borderWidth,

        borderLeftWidth,
        borderRightWidth,
        borderTopWidth,
        borderBottomWidth,

        maxWidth: "100%",
        opacity,
        flex,
        position,
        borderTopLeftRadius: radiusTop || radius,
        borderTopRightRadius: radiusTop || radius,
        borderBottomLeftRadius: radiusBottom || radius,
        borderBottomRightRadius: radiusBottom || radius,
        top,
        bottom,
        left,
        right,

        overflow,
        ...style,
      }}
      {...viewProps}
    >
      {children}
    </View>
  );
}

export function AnimatedBox({
  viewProps,
  style,
  children,
  block = false,
  direction = "column",
  gap,
  align,
  justify,
  borderColor = "transparent",
  borderWidth = 0,
  px,
  py,
  pa,
  mx,
  my,
  ma,
  pt,
  pb,
  pl,
  pr,
  mt,
  mb,
  ml,
  mr,
  width,
  height = "auto",
  color = "transparent",
  radius = 0,
  radiusTop,
  radiusBottom,
  flex,
  wrap,
  position,
  overflow,
  zIndex,
  opacity = 1,
}: AnimatedBoxProps) {
  return (
    <Animated.View
      style={[
        {
          flexDirection: direction,
          flexWrap: wrap,
          gap,
          alignItems: align,
          justifyContent: justify,
          width: width ? width : block ? "100%" : "auto",
          height: height,
          padding: pa,
          paddingHorizontal: px,
          paddingVertical: py,
          paddingLeft: pl,
          paddingRight: pr,
          paddingTop: pt,
          paddingBottom: pb,
          margin: ma,
          marginHorizontal: ma ? ma : mx,
          marginVertical: ma ? ma : my,
          marginLeft: ml,
          marginRight: mr,
          marginTop: mt,
          marginBottom: mb,
          backgroundColor: color,
          borderRadius: radius,
          borderColor,
          borderWidth,
          maxWidth: "100%",
          opacity,
          flex,
          position,
          zIndex,
          borderTopLeftRadius: radiusTop || radius,
          borderTopRightRadius: radiusTop || radius,
          borderBottomLeftRadius: radiusBottom || radius,
          borderBottomRightRadius: radiusBottom || radius,
          overflow,
        },
        style,
      ]}
      {...viewProps}
    >
      {children}
    </Animated.View>
  );
}

export function AnimateOnAppear({
  animation = "slideInRight",
  visible,
  viewStyle,
  duration,
  initialScale,
  children,
}: {
  animation?:
    | "slideInLeft"
    | "slideInRight"
    | "fadeInLeft"
    | "fadeInRight"
    | "slideInUp"
    | "slideInDown"
    | "fadeInUp"
    | "fadeInDown"
    | "fadeIn";
  visible: boolean;
  viewStyle?: ViewStyle;
  children: ReactNode;
  duration?: number;
  initialScale?: number;
}) {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    switch (animation) {
      case "slideInLeft":
        setOffsetX(-100);
        break;

      case "slideInRight":
        setOffsetX(100);
        break;
      case "fadeInLeft":
        setOffsetX(-100);
        setOpacity(0);
        break;
      case "fadeInRight":
        setOffsetX(100);
        setOpacity(0);
        break;
      case "slideInUp":
        setOffsetY(-100);
        break;

      case "slideInDown":
        setOffsetY(100);
        break;
      case "fadeInUp":
        setOffsetY(-100);
        setOpacity(0);
        break;
      case "fadeInDown":
        setOffsetY(100);
        setOpacity(0);
        break;
      case "fadeIn":
        setOffsetX(0);
        setOffsetY(0);
        setOpacity(1);
      default:
        break;
    }
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          from={{
            transform: [
              { translateX: offsetX },
              { translateY: offsetY },
              { scale: initialScale || 0.8 },
            ],
            opacity: opacity,
          }}
          animate={{
            transform: [{ translateY: 0 }, { translateX: 0 }, { scale: 1 }],
            opacity: 1,
          }}
          transition={{ type: "timing", duration: duration || 200 }}
          style={{ ...viewStyle }}
        >
          {children}
        </MotiView>
      )}
    </AnimatePresence>
  );
}
export function ShadowBox({
  shadowColor = "#000",
  shadowOpacity = 1,
  shadowOffset = { width: 0, height: 4 },
  shadowRadius = 6,
  elevation = 4,
  ...rest
}: ShadowBoxProps) {
  const shadowStyles = Platform.select({
    ios: {
      shadowColor,
      shadowOpacity,
      shadowOffset,
      shadowRadius,
    },
    android: {
      elevation,
    },
  });

  return (
    <Box
      style={{
        ...shadowStyles,
      }}
      {...rest}
    />
  );
}
interface ShadowBoxProps extends BoxProps {
  shadowColor?: string;
  shadowOpacity?: number;
  shadowOffset?: { width: number; height: number };
  shadowRadius?: number;
  elevation?: number;
}
export interface BoxProps {
  children?: ReactNode;
  block?: boolean;
  direction?: FlexStyle["flexDirection"];
  gap?: FlexStyle["gap"];
  align?: FlexStyle["alignItems"];
  alignSelf?: FlexStyle["alignSelf"];
  justify?: FlexStyle["justifyContent"];
  px?: DimensionValue;
  py?: DimensionValue;
  pa?: DimensionValue;
  mx?: DimensionValue;
  my?: DimensionValue;
  ma?: DimensionValue;
  pt?: DimensionValue;
  pb?: DimensionValue;
  pl?: DimensionValue;
  pr?: DimensionValue;
  mt?: DimensionValue;
  mb?: DimensionValue;
  ml?: DimensionValue;
  mr?: DimensionValue;
  borderTopWidth?: ViewStyle["borderTopWidth"];
  borderTopColor?: ViewStyle["borderTopColor"];
  borderRightWidth?: ViewStyle["borderRightWidth"];
  borderRightColor?: ViewStyle["borderRightColor"];
  borderBottomWidth?: ViewStyle["borderBottomWidth"];
  borderBottomColor?: ViewStyle["borderBottomColor"];
  borderLeftWidth?: ViewStyle["borderLeftWidth"];
  borderLeftColor?: ViewStyle["borderLeftColor"];
  borderWidth?: ViewStyle["borderWidth"];
  pointerEvents?: any;
  borderColor?: ViewStyle["borderColor"];
  width?: ViewStyle["width"];
  height?: ViewStyle["height"];
  color?: ViewStyle["backgroundColor"];
  radius?: ViewStyle["borderRadius"];
  wrap?: FlexStyle["flexWrap"];
  opacity?: ViewStyle["opacity"];
  flex?: FlexStyle["flex"];
  position?: ViewStyle["position"];
  radiusTop?: number;
  radiusBottom?: number;
  animated?: boolean;
  overflow?: ViewStyle["overflow"];
  viewProps?: Omit<ViewProps, "style">;
  top?: ViewStyle["top"];
  bottom?: ViewStyle["bottom"];
  left?: ViewStyle["left"];
  right?: ViewStyle["right"];
  zIndex?: ViewStyle["zIndex"];
  style?: ViewStyle;
}

export interface AnimatedBoxProps extends Omit<BoxProps, "style"> {
  style: any;
}

// No overload matches this call.
//   Overload 1 of 2, '(props: AnimateProps<ViewProps> | Readonly<AnimateProps<ViewProps>>): View', gave the following error.
//     Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; } | { ...; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//       Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//         Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'undefined'.
//   Overload 2 of 2, '(props: AnimateProps<ViewProps>, context: any): View', gave the following error.
//     Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; } | { ...; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//       Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'StyleProp<AnimateStyle<StyleProp<ViewStyle>>>'.
//         Type '{ backfaceVisibility?: "visible" | "hidden" | undefined; backgroundColor: ColorValue; borderBottomColor?: ColorValue | undefined; borderBottomEndRadius?: number | undefined; ... 83 more ...; translateY?: number | undefined; }' is not assignable to type 'undefined'.

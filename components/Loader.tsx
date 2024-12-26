import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { moderateScale } from "react-native-size-matters";

const RotatingImage = (props: { size: number }) => {
  const rotateValue = useRef(new Animated.Value(0)).current;

  const startRotation = () => {
    rotateValue.setValue(0);
    Animated.timing(rotateValue, {
      toValue: 1,
      duration: 3000, // Rotation duration in milliseconds
      easing: Easing.linear,
      useNativeDriver: true, // Enable native driver for performance
    }).start(() => startRotation());
  };

  useEffect(() => {
    startRotation();
  }, []);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.Image
      style={{
        width: moderateScale(props.size),
        height: moderateScale(props.size),
        transform: [{ rotate: spin }],
      }}
      source={require("@/assets/utils/loader.png")} // Replace with your image file
    />
  );
};

export default RotatingImage;

import { Image, Pressable, StyleSheet, View } from "react-native";
import React, { useState } from "react";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import MainButton from "@/components/MainButton";
import Box from "@/components/Box";
import { router } from "expo-router";
import userStore from "@/store/user.store";
import AddNewService from "./AddNewService";
import LoaderOverlay from "@/components/LoaderOverlay";

type FABTypes = {
  refresh: boolean;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
};
const FAB = ({ setRefresh }: FABTypes) => {
  const firstValue = useSharedValue(60);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const firstWidth = useSharedValue(60);
  const secondWidth = useSharedValue(60);
  const thirdWidth = useSharedValue(60);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0)
  );
  const { phone } = userStore();

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          firstValue.value = withTiming(30, config);
        }
      });
      secondWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          secondValue.value = withDelay(50, withTiming(30, config));
        }
      });
      thirdWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          thirdValue.value = withDelay(100, withTiming(30, config));
        }
      });
      opacity.value = withTiming(0, { duration: 100 });
    } else {
      firstValue.value = withDelay(200, withSpring(220));
      secondValue.value = withDelay(100, withSpring(150));
      thirdValue.value = withSpring(290);
      firstWidth.value = withDelay(1200, withSpring(200));
      secondWidth.value = withDelay(1100, withSpring(200));
      thirdWidth.value = withDelay(1000, withSpring(200));
      opacity.value = withDelay(1200, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  };

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    };
  });
  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    };
  });
  const thirdWidthStyle = useAnimatedStyle(() => {
    return {
      width: thirdWidth.value,
    };
  });

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 130],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 110],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [30, 290],
      [0, 1],
      Extrapolation.CLAMP
    );

    return {
      bottom: thirdValue.value,
      transform: [{ scale: scale }],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  const [addService, setAddService] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <View style={styles.container}>
      <LoaderOverlay open={loading} />
      <AddNewService
        open={addService}
        loading={loading}
        setLoading={setLoading}
        setOpen={setAddService}
      />
      {phone === "706828787" && (
        <Animated.View
          style={[styles.contentContainer, thirdIcon, thirdWidthStyle]}
        >
          <MainButton
            onPress={() => {
              //router.push("/home/create/");
              setAddService(true);
              handlePress();
            }}
            width={"100%"}
            direction="row"
            justify="center"
            align="center"
            color="transparent"
          >
            <Box direction="row" align="center">
              <View style={styles.iconContainer}>
                <MaterialIcons
                  color={"#fff"}
                  name="miscellaneous-services"
                  size={25}
                />
              </View>
              <Animated.Text style={[styles.text, opacityText]}>
                Add New Service
              </Animated.Text>
            </Box>
          </MainButton>
        </Animated.View>
      )}
      <Animated.View
        style={[styles.contentContainer, firstIcon, firstWidthStyle]}
      >
        <MainButton
          onPress={() => {
            router.push("/home/create/");
            handlePress();
          }}
          width={"100%"}
          direction="row"
          color="transparent"
        >
          <Box direction="row" align="center">
            <View style={styles.iconContainer}>
              <MaterialIcons color={"#fff"} name="group-add" size={25} />
            </View>
            <Animated.Text style={[styles.text, opacityText]}>
              Add Appointment
            </Animated.Text>
          </Box>
        </MainButton>
      </Animated.View>
      <Animated.View
        style={[styles.contentContainer, secondIcon, secondWidthStyle]}
      >
        <MainButton
          onPress={() => {
            setRefresh(true);

            handlePress();
          }}
          width={"100%"}
          direction="row"
          color="transparent"
        >
          <Box direction="row" align="center">
            <View style={styles.iconContainer}>
              <Entypo color={"#fff"} name="back-in-time" size={25} />
            </View>
            <Animated.Text style={[styles.text, opacityText]}>
              Refresh Schedule
            </Animated.Text>
          </Box>
        </MainButton>
      </Animated.View>

      <Pressable
        style={styles.contentContainer}
        onPress={() => {
          handlePress();
        }}
      >
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <Feather color={"#fff"} name="plus-circle" size={25} />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default FAB;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
  },
  contentContainer: {
    backgroundColor: Colors.theme.brownish,
    position: "absolute",
    bottom: 80,
    right: 30,
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 26,
    height: 26,
  },
  text: {
    color: "white",
    fontSize: 14,
  },
});

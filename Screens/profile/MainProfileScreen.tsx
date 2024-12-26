import { Animated, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Box from "@/components/Box";
import MainText from "@/components/MainText";
import user1 from "@/assets/animation/user1.json";
import user2 from "@/assets/animation/user2.json";
import user3 from "@/assets/animation/user3.json";
import user4 from "@/assets/animation/user4.json";
import user5 from "@/assets/animation/user5.json";
import user6 from "@/assets/animation/user6.json";
import LottieView from "lottie-react-native";
import userStore from "@/store/user.store";
import MainButton from "@/components/MainButton";
import ReAnimated, { FadeInDown } from "react-native-reanimated";
import { useIsFocused } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import { router, useFocusEffect } from "expo-router";
import Colors from "@/constants/Colors";
import {
  APPOINTMENT_COLLECTION,
  AppWriteAccount,
  client,
  DATABASE_ID,
  databases,
  USER_COLLECTION,
} from "@/utils/app.write";
import { Query } from "react-native-appwrite";
import LoaderOverlay from "@/components/LoaderOverlay";
import { width } from "@/app/(auth)/landing";
import { FlashMessage } from "@/components/FlashMessage";
import AvatarModal from "@/components/AvatarModal";

type Props = {};

const MainProfileScreen = (props: Props) => {
  const [targetNumber, setTarget] = useState(0);
  const [duration, setDur] = useState(2000);
  const [open, setOpen] = React.useState(false);
  const animations = [user1, user2, user3, user5];
  const { user, setCanAccessDashboard, setUser } = userStore();
  const animationRef = useRef<LottieView>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [currentNumber, setCurrentNumber] = useState(0);
  const [showText, setShowText] = useState(false);
  const isFocused = useIsFocused();
  const saveProfile = async (id: number) => {
    try {
      setLoading(true);
      setOpen(false);
      const userData = await databases.listDocuments(
        DATABASE_ID,
        USER_COLLECTION,
        [Query.equal("phoneNumber", user.phone)]
      );
      const res = await databases.updateDocument(
        DATABASE_ID, // databaseId
        USER_COLLECTION, // collectionId
        userData.documents[0].$id, // documentId
        { profile: id } // data (optional)
      );
      if (res) {
        FlashMessage("Profile saved successfully", "success");
        setUser({
          name: user.name,
          userId: user.userId,
          phone: user.phone,
          profile: id,
        });
      }
    } catch (e) {
      console.log("Error saving profile: ", e);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const startAnimation = useCallback(() => {
    // Reset the animation value and states
    animatedValue.setValue(0);
    setShowText(false);
    setCurrentNumber(0);

    // Start the animation
    Animated.timing(animatedValue, {
      toValue: targetNumber,
      duration: duration,
      useNativeDriver: false,
    }).start(() => {
      setShowText(true);
    });
  }, [targetNumber, duration, animatedValue]);

  // Set up the listener only once
  useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setCurrentNumber(Math.floor(value));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [animatedValue]);
  const [loading, setLoading] = useState(false);
  const getAppointments = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        DATABASE_ID,
        APPOINTMENT_COLLECTION,
        [Query.equal("userid", user?.userId)]
      );
      setTarget(res.documents.length);
      console.log(res, "appointments");
    } catch (error) {
      console.log("Error fetching appointments", error);
    } finally {
      startAnimation();
      setLoading(false);
    }
  };
  // Trigger animation when tab is focused
  useFocusEffect(
    useCallback(() => {
      if (isFocused) {
        getAppointments();
      }
      return () => {
        // Cleanup if needed
      };
    }, [isFocused, startAnimation])
  );

  return (
    <Box width={"100%"} height={"100%"} align="center">
      <LoaderOverlay open={loading} />
      <AvatarModal saving={saveProfile} open={open} setOpen={setOpen} />
      <Box>
        <MainButton onPress={() => setOpen(true)} color="transparent">
          {user?.profile && (
            <LottieView
              autoPlay
              ref={animationRef}
              resizeMode="cover"
              style={{
                width: 250,
                height: 250,
                marginHorizontal: 10,
                padding: 5,
              }}
              source={animations[user.profile - 1]}
            />
          )}
        </MainButton>
      </Box>

      <Box px={20} align="center" width={"100%"}>
        <MainText size={24}>Welcome, {user?.name}</MainText>
      </Box>

      <Box mt={10} px={20} align="center" width={"100%"}>
        <MainText>More info</MainText>
        <Box>
          <MainText color="#828282">Phone Number: {user?.phone}</MainText>
        </Box>
      </Box>

      <Box align="center">
        <MainText
          isHeading
          color={Colors.theme.brownish}
          size={moderateScale(80)}
        >
          {currentNumber}
        </MainText>
        {showText && (
          <ReAnimated.Text
            entering={FadeInDown}
            style={[styles.text, { opacity: showText ? 1 : 0 }]}
          >
            {targetNumber > 1 ? "Appointments" : "Appointment"} Created
          </ReAnimated.Text>
        )}
      </Box>
      <Box position="absolute" bottom={120}>
        <MainButton
          size="xl"
          color="transparent"
          borderWidth={0.7}
          borderColor={"#FD7D57"}
          pa={10}
          width={width * 0.7}
          onPress={() => {
            // Navigate to appointments screen
          }}
        >
          <MainText color={Colors.theme.brownish}>Delete Account</MainText>
        </MainButton>
        <MainButton
          size="xl"
          color="transparent"
          pa={10}
          width={width * 0.7}
          mt={10}
          onPress={async () => {
            setCanAccessDashboard(false);
            setUser(null);
            await AppWriteAccount.deleteSessions();
            router.replace("/(auth)/landing");
          }}
        >
          <MainText color={"#FD7D57"}>Logout</MainText>
        </MainButton>
      </Box>
    </Box>
  );
};

export default MainProfileScreen;

const styles = StyleSheet.create({
  text: {
    marginTop: -10,
    fontSize: 18,
    color: "#666",
    fontFamily: "Baloo2_400Regular",
  },
});

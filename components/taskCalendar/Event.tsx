import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";

import { TEvent } from "./types";
import { typography } from "@/utils/typography";
import EventIndicator from "./EventIndicator";
import { DATA } from "@/components/likeInteraction/data";
import ListItem from "@/components/likeInteraction/ListItem";
import { DATABASE_ID, databases, USER_COLLECTION } from "@/utils/app.write";
import { Query } from "react-native-appwrite";
import user1 from "@/assets/animation/user1.json";
import user2 from "@/assets/animation/user2.json";
import user3 from "@/assets/animation/user3.json";
import user4 from "@/assets/animation/user4.json";
import user5 from "@/assets/animation/user5.json";
import user6 from "@/assets/animation/user6.json";
import LottieView from "lottie-react-native";
import MainText from "../MainText";
import Colors from "@/constants/Colors";

const Event = ({
  time,
  title,
  description,
  duration,
  name,
  userid,
}: TEvent) => {
  const animations = [user1, user2, user3, user5];
  const animationRef = useRef<LottieView>(null);
  const [prof, setProf] = useState<any>();
  const getProfile = useCallback(async () => {
    const res = await databases.listDocuments(DATABASE_ID, USER_COLLECTION, [
      Query.equal("userId", userid),
    ]);
    console.log();
    setProf(res.documents[0]?.profile);
  }, [userid]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const colorScheme = useColorScheme();
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown.duration(25)}
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark" ? Colors.theme.lightBlack : "white",
        },
      ]}
    >
      <View style={styles.users}>
        {prof && (
          <LottieView
            //duration={5000}
            autoPlay
            ref={animationRef}
            resizeMode="cover"
            style={{
              width: 50,
              height: 50,
              marginHorizontal: 10,
              padding: 5,

              //   backgroundColor: Colors.theme.lightPink,
            }}
            source={animations[prof - 1]}
          />
        )}
      </View>
      <View>
        <MainText style={styles.time}>{time}</MainText>
        <MainText style={styles.title}>{title}</MainText>
        <MainText style={styles.description}>{name}</MainText>
      </View>

      {/* <EventIndicator label={duration} /> */}
    </Animated.View>
  );
};

export default Event;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: "white",
    padding: 20,
    borderRadius: 17,
    marginTop: 4,
    minHeight: 110,
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
    // fontFamily: typography.medium,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    marginVertical: 8,
    //fontFamily: typography.semiBold,
  },
  description: {
    fontSize: 14,
    // fontFamily: typography.medium,
  },
  users: {
    position: "absolute",
    right: 20,
    top: 10,
  },
});

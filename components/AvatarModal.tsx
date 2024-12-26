import { StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Overlay } from "@rneui/themed";
import Box from "./Box";
import user1 from "@/assets/animation/user1.json";
import user2 from "@/assets/animation/user2.json";
import user3 from "@/assets/animation/user3.json";
import user4 from "@/assets/animation/user4.json";
import user5 from "@/assets/animation/user5.json";
import user6 from "@/assets/animation/user6.json";
import LottieView from "lottie-react-native";
import { height, width } from "@/app/(auth)/landing";
import MainButton from "./MainButton";
import MainText from "./MainText";
import Colors from "@/constants/Colors";
import FadeInTransition from "./FadeInTransition";
import { useIsFocused } from "@react-navigation/native";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  saving: (profile: any) => void;
};

const AvatarModal = ({ open, setOpen, saving }: Props) => {
  const animations = [user1, user2, user3, user5];
  const animationRef = useRef<LottieView>(null);
  const colorScheme = useColorScheme();
  const [selectedAnimation, setSelectedAnimation] = useState(1);
  const isFocused = useIsFocused();

  return (
    <Overlay
      isVisible={open}
      onBackdropPress={() => setOpen(false)}
      transparent
      statusBarTranslucent
      overlayStyle={{
        backgroundColor:
          colorScheme === "dark" ? Colors.theme.lightBlack : "white",
      }}
    >
      <Box>
        <Box mx={10}>
          <MainText isHeading size={24}>
            Select Avatar
          </MainText>
        </Box>
        <FadeInTransition animate={isFocused} direction="left">
          <Box
            width={width * 0.85}
            height={height * 0.25}
            align="center"
            justify="center"
            direction="row"
            wrap="wrap"
          >
            {animations.map((animation, i) => (
              <MainButton
                key={i}
                mt={10}
                width={80}
                height={80}
                radius={40}
                mx={10}
                onPress={() => {
                  setSelectedAnimation(i + 1);
                  animationRef.current?.play();
                }}
                align="center"
                justify="center"
                color={selectedAnimation === i + 1 ? "#E4E3E9" : "transparent"}
              >
                <LottieView
                  //duration={5000}
                  autoPlay
                  ref={animationRef}
                  resizeMode="cover"
                  style={{
                    width: 80,
                    height: 80,
                    marginHorizontal: 10,
                    padding: 5,

                    //   backgroundColor: Colors.theme.lightPink,
                  }}
                  source={animation}
                />
              </MainButton>
            ))}
          </Box>
          <Box width={"100%"} mb={10} align="center">
            <MainButton
              width={width * 0.6}
              height={40}
              onPress={() => {
                saving(selectedAnimation);
              }}
              alignSelf="center"
              color={Colors.theme.brownish}
            >
              <MainText color={"#fff"} isHeading>
                Finish
              </MainText>
            </MainButton>
          </Box>
        </FadeInTransition>
      </Box>
    </Overlay>
  );
};

export default AvatarModal;

const styles = StyleSheet.create({});

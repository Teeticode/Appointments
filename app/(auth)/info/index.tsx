import {
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import React, { useState } from "react";
import Box from "@/components/Box";
import MainText from "@/components/MainText";
import { SafeAreaView } from "react-native-safe-area-context";
import { height, width } from "../landing";
import { verticalScale } from "react-native-size-matters";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Colors from "@/constants/Colors";
import MainButton from "@/components/MainButton";
import BackHeader from "@/components/BackHeader";
import useForm from "@/utils/useForm";
import { z } from "zod";
import {
  AppWriteAccount,
  client,
  DATABASE_ID,
  USER_COLLECTION,
} from "@/utils/app.write";
import { Databases, ID } from "react-native-appwrite";
import LoaderOverlay from "@/components/LoaderOverlay";
import { FlashMessage } from "@/components/FlashMessage";
import { router } from "expo-router";
import userStore from "@/store/user.store";
import AvatarModal from "@/components/AvatarModal";

type Props = {};

const InfoMain = (props: Props) => {
  const colorScheme = useColorScheme();
  const { setUserId, setPhone, userId, phone, setCanAccessDashboard, setUser } =
    userStore();
  const { getFormValue, setFormValue } = useForm([
    {
      name: "name",
      value: "",
      schema: z.string(),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const addUserData = async (profile: any) => {
    try {
      setLoading(true);

      const databases = new Databases(client);

      const result = await databases.createDocument(
        DATABASE_ID, // databaseId
        USER_COLLECTION, // collectionId
        userId, // documentId
        {
          name: getFormValue("name"),
          phoneNumber: phone,
          userId: userId,
          profile: profile,
        }
      );
      if (result) {
        FlashMessage("Created your account successfully", "success");
        setCanAccessDashboard(true);
        setUser({
          name: getFormValue("name"),
          phone: phone,
          userId: userId,
          profile: profile,
        });
        router.replace("/(tabs)/home/");
      } else {
        FlashMessage("Failed to create your account, try again!", "danger");
      }

      console.log(result);
    } catch (err) {
      console.log(err);
      FlashMessage("Failed to create your account, try again!", "danger");
    } finally {
      setLoading(false);
    }
  };
  const updateUser = async () => {
    try {
      setLoading(true);

      const result = await AppWriteAccount.updateName(getFormValue("name"));

      if (result) {
        FlashMessage("Created your account successfully", "success");
        setCanAccessDashboard(true);
        setUser({
          name: getFormValue("name"),
          phone: phone,
          userId: userId,
        });
      } else {
        FlashMessage("Failed to create your account, try again!", "danger");
      }

      console.log(result);
    } catch (err) {
      console.log(err);
      FlashMessage("Failed to create your account, try again!", "danger");
    } finally {
      setLoading(false);
    }
  };

  const [showAvatar, setShowAvatar] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const save = (profile: any) => {
    setAvatar(profile);
    console.log(profile);
    setShowAvatar(false);
    addUserData(profile);
  };

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <AvatarModal saving={save} open={showAvatar} setOpen={setShowAvatar} />
        <BackHeader />
        <LoaderOverlay open={loading} />
        <Box width={width} align="center" height={height}>
          <Box align="center" width={"100%"} height={"80%"} mt={20}>
            <MainText size={"xxl"} isHeading>
              What's your name?
            </MainText>
            <Box
              direction="row"
              align="center"
              width={"80%"}
              height={60}
              pa={10}
              alignSelf="center"
              mt={verticalScale(30)}
            >
              {/* <Box height={"100%"}>
                <MainText size={"xxl"}>+254</MainText>
              </Box> */}
              <Box ml={10} width={"80%"}>
                <TextInput
                  placeholder="Your name"
                  //  maxLength={9}
                  placeholderTextColor={
                    colorScheme === "dark" ? "lightgray" : "lightgray"
                  }
                  value={getFormValue("name")}
                  onChangeText={(text) => {
                    setFormValue("name", text);
                  }}
                  style={[
                    styles.textInput,
                    { color: colorScheme === "dark" ? "#fff" : "#000" },
                  ]}
                  cursorColor={Colors.theme.brownish}
                />
              </Box>
            </Box>
            <Box width={"70%"} align="center">
              <MainText color={"#B3B3B3"} align="center" size={"sm"}>
                welcome to vee nail parlour, just a step away from the finish
                line{" "}
                {/* <MainText
                  size={"sm"}
                  color={"#B3B3B3"}
                  style={{ textDecorationLine: "underline" }}
                >
                  terms of service
                </MainText>{" "}
                and{" "}
                <MainText
                  size={"sm"}
                  color={"#B3B3B3"}
                  style={{ textDecorationLine: "underline" }}
                >
                  privacy policy
                </MainText>{" "} */}
              </MainText>
            </Box>
            <Box mt={verticalScale(100)}>
              <MainButton
                color={Colors.theme.brownish}
                width={width * 0.55}
                height={55}
                onPress={() => setShowAvatar(true)}
                disabled={
                  getFormValue("name")?.split("")?.length > 4 ? false : true
                }
              >
                <MainText color={"#fff"} isHeading>
                  Next
                </MainText>
              </MainButton>
            </Box>
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default InfoMain;

const styles = StyleSheet.create({
  textInput: {
    fontSize: 22,
    alignItems: "center",
    textAlign: "center",
    height: 60,
  },
});

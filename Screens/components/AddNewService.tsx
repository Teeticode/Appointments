import {
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Overlay } from "@rneui/themed";

import user1 from "@/assets/animation/user1.json";
import user2 from "@/assets/animation/user2.json";
import user3 from "@/assets/animation/user3.json";
import user4 from "@/assets/animation/user4.json";
import user5 from "@/assets/animation/user5.json";
import user6 from "@/assets/animation/user6.json";
import LottieView from "lottie-react-native";
import { height, width } from "@/app/(auth)/landing";

import Colors from "@/constants/Colors";
import { useIsFocused } from "@react-navigation/native";
import Box from "@/components/Box";
import MainText from "@/components/MainText";
import FadeInTransition from "@/components/FadeInTransition";
import MainButton from "@/components/MainButton";
import useForm from "@/utils/useForm";
import { z } from "zod";
import userStore from "@/store/user.store";
import { Databases } from "react-native-appwrite";
import { client, DATABASE_ID, SERVICES_COLLECTION } from "@/utils/app.write";
import { FlashMessage } from "@/components/FlashMessage";
import LoaderOverlay from "@/components/LoaderOverlay";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
};

const AddNewService = ({ open, setOpen, setLoading }: Props) => {
  const animations = [user1, user2, user3, user5];
  const animationRef = useRef<LottieView>(null);
  const colorScheme = useColorScheme();
  const [selectedAnimation, setSelectedAnimation] = useState(1);
  const isFocused = useIsFocused();

  const { getFormValue, setFormValue } = useForm([
    {
      name: "serviceName",
      value: "",
      schema: z.string().min(2).max(50),
    },
  ]);

  const { user } = userStore();

  const createService = async () => {
    try {
      if (getFormValue("serviceName")?.split("")?.length > 0) {
        setLoading(true);
        setOpen(false);

        const databases = new Databases(client);

        const result = await databases.createDocument(
          DATABASE_ID, // databaseId
          SERVICES_COLLECTION, // collectionId
          `${Math.floor(Math.random() * 1000000000)}`, // documentId
          {
            Name: getFormValue("serviceName"),
          }
        );
        if (result) {
          FlashMessage("Created your service successfully", "success");
          setOpen(false);
        } else {
          FlashMessage("Failed to create your service, try again!", "danger");
        }

        console.log(result);
        setOpen(false);
      } else {
        FlashMessage("Fill in all fields please!", "danger");
        setOpen(true);
      }
    } catch (err) {
      console.log(err);
      FlashMessage("Failed to create your service, try again!", "danger");
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay
      isVisible={open}
      onBackdropPress={() => setOpen(false)}
      transparent
      statusBarTranslucent
      overlayStyle={{
        backgroundColor:
          colorScheme === "dark" ? Colors.theme.lightBlack : "white",
        borderRadius: 10,
      }}
    >
      <Box>
        <Box mx={10}>
          <MainText isHeading size={24}>
            Create A New Service
          </MainText>
        </Box>
        <FadeInTransition animate={isFocused || open} direction="top-scale">
          <Box
            width={width * 0.85}
            height={height * 0.2}
            align="center"
            pt={30}
            justify="center"
            direction="row"
            wrap="wrap"
          >
            <TextInput
              placeholder="Name of Service"
              //  maxLength={9}
              placeholderTextColor={
                colorScheme === "dark" ? "lightgray" : "lightgray"
              }
              value={getFormValue("serviceName")}
              onChangeText={(text) => {
                setFormValue("serviceName", text);
              }}
              style={[
                styles.textInput,
                { color: colorScheme === "dark" ? "#fff" : "#000" },
                {
                  borderColor:
                    useColorScheme() === "dark" ? "#fff" : "lightgray",
                },
              ]}
              cursorColor={Colors.theme.brownish}
            />
          </Box>
          <Box width={"100%"} mb={10} align="center">
            <MainButton
              width={width * 0.6}
              height={40}
              alignSelf="center"
              onPress={() => createService()}
              color={Colors.theme.brownish}
            >
              <MainText color={"#fff"} isHeading>
                Create Service
              </MainText>
            </MainButton>
          </Box>
        </FadeInTransition>
      </Box>
    </Overlay>
  );
};

export default AddNewService;

const styles = StyleSheet.create({
  textInput: {
    fontSize: 18,
    alignItems: "center",
    // textAlign: "center",
    height: 60,
    width: "100%",
    borderWidth: 1,

    borderRadius: 10,
    paddingHorizontal: 20,
  },
});

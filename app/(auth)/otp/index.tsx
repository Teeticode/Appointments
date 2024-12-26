import { Platform, StyleSheet, Text, useColorScheme, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import BackHeader from "@/components/BackHeader";
import Box from "@/components/Box";
import { height, width } from "../landing";
import MainText from "@/components/MainText";
import {
  AppWriteAccount,
  client,
  DATABASE_ID,
  databases,
  USER_COLLECTION,
} from "@/utils/app.write";
import { Databases, ID, Query } from "react-native-appwrite";
import userStore from "@/store/user.store";
import { FlashMessage } from "@/components/FlashMessage";

import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import Colors from "@/constants/Colors";
import { verticalScale } from "react-native-size-matters";
import MainButton from "@/components/MainButton";
import LoaderOverlay from "@/components/LoaderOverlay";
import { router } from "expo-router";

const stylesCode = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 20 },
  cell: {
    width: 45,
    height: 45,
    lineHeight: 42,
    fontSize: 24,
    borderWidth: 0.5,
    marginHorizontal: 4,
    borderRadius: 10,
    textAlign: "center",
  },
  focusCell: {
    borderColor: Colors.theme.brownish,
  },
});

type Props = {};

const CELL_COUNT = 6;
const RESEND_TIMEOUT = 30; // 2 minutes in seconds

const MainOtp = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const {
    phone,
    userId,
    setUser,
    setCanAccessDashboard,
    setSessionExpiresIn,
    dialCode,
  } = userStore();
  const [value, setValue] = useState("");
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [codeProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setCanResend(true);
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const resendOtp = async () => {
    if (!canResend) return;

    try {
      setLoading(true);
      const token = await AppWriteAccount.createPhoneToken(
        ID.unique(),
        `${dialCode}${phone}`
      );
      if (token?.userId) {
        FlashMessage("Otp Sent to number", "success");
        setTimer(RESEND_TIMEOUT);
        setCanResend(false);
      } else {
        FlashMessage("Failed to send Otp, try again!", "danger");
      }
      console.log(token);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const colorScheme = useColorScheme();
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const session = await AppWriteAccount.createSession(userId, value);

      if (session) {
        // FlashMessage("Otp has been verified", "success");
        // setTimer(RESEND_TIMEOUT);
        // setCanResend(false);
        // router.push("/(auth)/info");
        setSessionExpiresIn(session.expire);
        checkIfRegistered();
      } else {
        FlashMessage("Failed to send Otp, try again!", "danger");
      }
      console.log(session);
    } catch (err) {
      console.log(err);
      FlashMessage("Failed to verify Otp, try again!", "danger");
      await AppWriteAccount.deleteSessions();
    } finally {
      setLoading(false);
    }
  };

  const checkIfRegistered = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(DATABASE_ID, USER_COLLECTION, [
        Query.equal("phoneNumber", phone),
      ]);
      if (res.documents?.length === 1) {
        FlashMessage("Logged in Successfully", "success");
        //router.push("/(tabs)/");
        setUser({
          name: res.documents[0]?.name,
          phone: res.documents[0]?.phoneNumber,
          userId: userId,
          profile: res.documents[0]?.profile,
        });
        setCanAccessDashboard(true);
        router.replace("/(tabs)/home/");
      } else {
        FlashMessage("Otp has been verified", "success");
        setTimer(RESEND_TIMEOUT);
        setCanResend(false);
        router.push("/(auth)/info");
      }
    } catch (err) {
      console.log(err);
      FlashMessage("Something went wrong, try again!", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView>
      <BackHeader />
      <LoaderOverlay open={loading} />
      <Box pa={10} mt={20} align="center" width={width} height={height}>
        <Box width={"80%"}>
          <MainText align="center" size={"lg"} isHeading>
            Please enter code we sent to your phone number
          </MainText>
        </Box>
        <Box mt={20}>
          <CodeField
            ref={ref}
            {...codeProps}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={stylesCode.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete={Platform.select({
              android: "sms-otp",
              default: "one-time-code",
            })}
            testID="my-code-input"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[
                  stylesCode.cell,
                  {
                    borderColor: colorScheme === "dark" ? "#fff" : "#000",
                    color: colorScheme === "dark" ? "#fff" : "#000",
                  },
                  isFocused && stylesCode.focusCell,
                ]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </Box>
        <Box mt={20} direction="row" align="center" my={10}>
          <MainText>Didn't get otp?</MainText>
          {timer > 0 ? (
            <MainText ml={5}>Resend in {formatTime(timer)}</MainText>
          ) : (
            <MainButton onPress={resendOtp} ml={5} color="transparent">
              <MainText style={{ textDecorationLine: "underline" }}>
                Resend
              </MainText>
            </MainButton>
          )}
        </Box>
        <Box mt={verticalScale(100)}>
          <MainButton
            color={Colors.theme.brownish}
            width={width * 0.55}
            height={55}
            onPress={verifyOtp}
            disabled={value?.split("")?.length === 6 ? false : true}
          >
            <MainText color={"#fff"} isHeading>
              Next
            </MainText>
          </MainButton>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default MainOtp;

const styles = StyleSheet.create({});

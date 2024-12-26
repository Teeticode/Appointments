import {
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
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
import { AppWriteAccount } from "@/utils/app.write";
import { ID } from "react-native-appwrite";
import LoaderOverlay from "@/components/LoaderOverlay";
import { FlashMessage } from "@/components/FlashMessage";
import { router, useFocusEffect } from "expo-router";
import userStore from "@/store/user.store";
import { getCurrencies, getLocales } from "react-native-localize";
import { countries } from "@/utils/countries";
export interface Country {
  name: string;
  code: string;
  emoji: string;
  unicode: string;
  image: string;
  dial_code: string;
}
type Props = {};

const SignInMain = (props: Props) => {
  const colorScheme = useColorScheme();
  const { setUserId, setPhone, setDialCode } = userStore();
  const [countrie, setCountries] = useState<Country[]>(countries);
  const [currentCountry, setCurrentCountry] = useState<Country>();
  const { getFormValue, setFormValue } = useForm([
    {
      name: "phone",
      value: "",
      schema: z.string(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState<any>();

  useEffect(() => {
    const co = countrie?.find((country) => {
      if (country.code === countryCode) {
        return true;
      } else {
        return false;
      }
    });

    if (co) {
      setCurrentCountry(co);
      setDialCode(co.dial_code);
    }
  }, [countrie, countryCode]);

  const sendOTP = async () => {
    try {
      setLoading(true);
      const token = await AppWriteAccount.createPhoneToken(
        ID.unique(),
        `${currentCountry?.dial_code}${getFormValue("phone")}`
      );
      if (token?.userId) {
        FlashMessage("Otp Sent to number", "success");
        setUserId(token.userId);
        setPhone(getFormValue("phone"));
        router.push("/(auth)/otp");
      } else {
        FlashMessage("Failed to send Otp, try again!", "danger");
      }
      console.log(token);
    } catch (err) {
      console.log(err);
      FlashMessage("Failed to send Otp, try again!", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("http://ip-api.com/json/", { method: "GET" });
        const data = await res.json();
        console.log(data);
        setCountryCode(data.countryCode);
        if (data) {
          setCountryCode(data.countryCode);
        } else {
          setCountryCode(getLocales()[0].countryCode);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView>
      <KeyboardAwareScrollView>
        <BackHeader />
        <LoaderOverlay open={loading} />
        <Box width={width} align="center" height={height}>
          <Box align="center" width={"100%"} height={"80%"} mt={20}>
            <MainText size={"xxl"} align="center" isHeading>
              What's your number?
            </MainText>
            <Box
              direction="row"
              align="center"
              width={"70%"}
              height={65}
              pa={10}
              alignSelf="center"
              mt={verticalScale(30)}
            >
              <Box height={"70%"}>
                <MainText size={"xl"}>
                  {currentCountry?.emoji} {currentCountry?.dial_code}
                </MainText>
              </Box>
              <Box ml={10} width={"80%"}>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="phone number"
                  maxLength={19}
                  value={getFormValue("phone")}
                  placeholderTextColor={
                    colorScheme === "dark" ? "lightgray" : "lightgray"
                  }
                  onChangeText={(text) => {
                    setFormValue("phone", text);
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
                by entering your number, you're agreeing to our{" "}
                <MainText
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
                </MainText>{" "}
                thanks!
              </MainText>
            </Box>
            <Box mt={verticalScale(100)}>
              <MainButton
                color={Colors.theme.brownish}
                width={width * 0.55}
                height={55}
                onPress={sendOTP}
                disabled={
                  getFormValue("phone")?.split("")?.length >= 9 ? false : true
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

export default SignInMain;

const styles = StyleSheet.create({
  textInput: {
    fontSize: 22,
    alignItems: "center",
    //textAlign: "center",
    height: 60,
  },
});

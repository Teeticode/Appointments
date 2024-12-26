import {
  StyleSheet,
  Text,
  View,
  Alert,
  AppState,
  AppStateStatus,
  useColorScheme,
} from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import userStore from "@/store/user.store";
import Box from "@/components/Box";
import { Overlay } from "@rneui/themed";
import { Entypo } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { height, width } from "@/app/(auth)/landing";
import MainText from "@/components/MainText";
import MainButton from "@/components/MainButton";
import Colors from "@/constants/Colors";
import { AppWriteAccount } from "@/utils/app.write";
import { router } from "expo-router";

type Props = {
  children: React.ReactNode;
};

const SessionContext = ({ children }: Props) => {
  const { sessionExpiresIn } = userStore();
  const warningShownRef = useRef(false);
  const expirationTimeout = useRef<NodeJS.Timeout>();
  const warningTimeout = useRef<NodeJS.Timeout>();
  const [show, setShow] = useState(false);

  const setupExpirationTimers = () => {
    // Clear any existing timers
    if (expirationTimeout.current) clearTimeout(expirationTimeout.current);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);

    if (!sessionExpiresIn) return;

    const now = new Date().getTime();
    const expiration = new Date(sessionExpiresIn).getTime();
    const timeUntilExpiration = expiration - now;

    // If already expired, handle immediately
    if (timeUntilExpiration <= 0) {
      handleExpiredSession();
      return;
    }

    // Set warning for 5 minutes before expiration
    const warningTime = timeUntilExpiration - 5 * 60 * 1000;
    if (warningTime > 0 && !warningShownRef.current) {
      warningTimeout.current = setTimeout(() => {
        showExpirationWarning(5);
        warningShownRef.current = true;
      }, warningTime);
    }

    // Set final expiration timeout
    expirationTimeout.current = setTimeout(
      handleExpiredSession,
      timeUntilExpiration
    );
  };

  const handleExpiredSession = () => {
    setShow(true);
    // Alert.alert(
    //   "Session Expired",
    //   "Your session has expired. Please log in again.",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         // Call your logout function from userStore
    //         // Example: userStore.getState().logout();
    //         // Navigate to login screen
    //         // Example: navigation.replace('Login');
    //       },
    //     },
    //   ]
    // );
  };

  const showExpirationWarning = (minutesLeft: number) => {
    Alert.alert(
      "Session Expiring Soon",
      `Your session will expire in ${minutesLeft} minutes. Please save your work.`,
      [{ text: "OK" }]
    );
  };

  useEffect(() => {
    // Handle app state changes
    const subscription = AppState.addEventListener(
      "change",
      (nextAppState: AppStateStatus) => {
        if (nextAppState === "active") {
          // Recalculate timers when app comes to foreground
          setupExpirationTimers();
        }
      }
    );

    // Initial setup
    setupExpirationTimers();

    // Cleanup
    return () => {
      subscription.remove();
      if (expirationTimeout.current) clearTimeout(expirationTimeout.current);
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
    };
  }, [sessionExpiresIn]);

  return (
    <>
      <SessionExpiringModal open={show} setOpen={setShow} />
      {children}
    </>
  );
};

export default SessionContext;

const styles = StyleSheet.create({});

type ExpiringSoon = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SessionExpiringModal = ({ open, setOpen }: ExpiringSoon) => {
  const colorScheme = useColorScheme();
  const { setCanAccessDashboard, setUser } = userStore();
  return (
    <Overlay
      statusBarTranslucent
      isVisible={open}
      transparent={true}
      overlayStyle={{
        borderRadius: 10,
        backgroundColor: colorScheme === "dark" ? "#454545" : "#fff",
      }}
    >
      <Box
        radius={10}
        width={width * 0.85}
        align="center"
        height={height * 0.2}
      >
        <Box>
          <Entypo
            name="info-with-circle"
            size={moderateScale(34)}
            style={{ opacity: 0.7 }}
            color={colorScheme === "dark" ? "#fff" : "#000"}
          />
        </Box>
        <Box mt={10}>
          <MainText align="center">
            Your session has expired, please login to continue using the app
          </MainText>
        </Box>
        <Box mt={moderateScale(15)}>
          <MainButton
            color={Colors.theme.brownish}
            width={width * 0.6}
            height={40}
            onPress={async () => {
              setCanAccessDashboard(false);
              setUser(null);
              await AppWriteAccount.deleteSessions();
              setOpen(false);
              router.replace("/(auth)/landing");
            }}
          >
            <MainText color={"#fff"}>Login</MainText>
          </MainButton>
        </Box>
      </Box>
    </Overlay>
  );
};

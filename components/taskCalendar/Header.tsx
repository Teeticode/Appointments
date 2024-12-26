import Animated, {
  FadeInDown,
  useSharedValue,
  LinearTransition,
} from "react-native-reanimated";
import { StyleSheet, useColorScheme, View } from "react-native";
import React, { memo, useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { THeader } from "./types";
import Calendar from "./Calendar";
import MenuIcon from "./MenuIcon";
import { isIOS } from "@/utils/device";
import MonthPicker from "./MonthPicker";
import { ANIMATION_DUR } from "./constants";
import MonthListModal from "./MonthListModal";
import { Overlay } from "@rneui/themed";
import Box from "../Box";
import { height, width } from "@/app/(auth)/landing";
import Colors from "@/constants/Colors";

const Header = ({ month, selectedDate, onSelecteMonth, create }: THeader) => {
  const insets = useSafeAreaInsets();

  const fadeFinished = useSharedValue(false);

  const paddingTop = insets.top > 32 ? insets.top : 32;

  const entering = FadeInDown.delay(isIOS ? 50 : 100)
    .duration(ANIMATION_DUR)
    .withCallback((finished) => {
      if (finished) {
        fadeFinished.value = true;
      }
    });

  // const onPressMonthPicker = useCallback(() => {
  //   console.log("onPressMonthPicker");

  //   setModalInfo({
  //     content: (
  //       <View style={styles.modalContainer}>
  //         <MonthListModal
  //           month={month}
  //           setMonth={(month) => {
  //             onSelecteMonth(month);
  //           }}
  //         />
  //       </View>
  //     ),
  //     modalHeight: 350,
  //     lineStyle: styles.linStyle,
  //     contentContainerStyle: styles.modalInnerContainer,
  //   });
  // }, [month]);

  const executeChild = (cb: () => void) => {
    !!cb && cb();
  };
  const colorScheme = useColorScheme();
  const [show, setShow] = useState(false);

  return (
    <Animated.View
      layout={LinearTransition}
      style={[styles.container, { paddingTop }]}
    >
      <Animated.View>
        <MenuIcon create={create!} />
        <MonthPicker month={month} onPress={() => setShow(!show)} />
        <Calendar
          month={month}
          fadeFinished={fadeFinished}
          executeChild={executeChild}
          selectedDate={selectedDate}
        />
        <Overlay
          statusBarTranslucent
          isVisible={show}
          onBackdropPress={() => setShow(false)}
          overlayStyle={{
            backgroundColor:
              colorScheme === "dark" ? Colors.theme.lightBlack : "white",
            borderRadius: 10,
          }}
          transparent={true}
        >
          <Box
            width={width * 0.8}
            height={height * 0.2}
            //align="center"
            justify="center"
          >
            <MonthListModal
              month={month}
              setMonth={(month) => {
                onSelecteMonth(month);
              }}
            />
          </Box>
        </Overlay>
      </Animated.View>
    </Animated.View>
  );
};

export default memo(Header);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.theme.brownish,
    paddingBottom: 16,
    borderRadius: 32,
    overflow: "hidden",
  },
  firstRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    justifyContent: "space-between",
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#121212",
    borderRadius: 0,
    elevation: 10,
  },
  modalInnerContainer: {
    borderRadius: 0,
    backgroundColor: "#121212",
    borderWidth: isIOS ? 0 : 2,
    borderTopColor: "white",
    shadowColor: "white",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  linStyle: {
    marginTop: 16,
    backgroundColor: "white",
  },
});

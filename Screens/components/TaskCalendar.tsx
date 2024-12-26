import { FlatList, StyleSheet, useColorScheme } from "react-native";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

import {
  TEvent,
  TNavigation,
  TCalendarState,
} from "@/components/taskCalendar/types";
import Event from "@/components/taskCalendar/Event";
import Header from "@/components/taskCalendar/Header";
import Loading from "@/components/taskCalendar/Loading";
import { MONTHS } from "@/components/taskCalendar/constants";
import ListEmpty from "@/components/taskCalendar/ListEmpty";
import StatusBarManager from "@/components/StatusBarManager";
import { useCalendarEvents } from "@/components/taskCalendar/hooks/useCalendarEvents";
import Box from "@/components/Box";
import { useFocusEffect } from "expo-router";
import {
  APPOINTMENT_COLLECTION,
  DATABASE_ID,
  databases,
} from "@/utils/app.write";
import { Query } from "react-native-appwrite";
import LoaderOverlay from "@/components/LoaderOverlay";
import FAB from "./FAB";
import { useNavigation } from "@react-navigation/native";
import { width } from "@/app/(auth)/landing";
import { MotiView } from "moti";
import { Skeleton } from "moti/skeleton";

export const today = new Date();
type CalendarTypes = {
  navigation?: TNavigation;
  refresh: boolean;
  setRefresh: Dispatch<SetStateAction<boolean>>;
};

const initialState = {
  loading: true,
  month: MONTHS[new Date().getMonth()],
  transitionEnd: false,
  selectedDate: today,
};

const TaskCalendar = ({ refresh, setRefresh }: CalendarTypes) => {
  const [state, setState] = React.useState<TCalendarState>(initialState);
  const [filteredEvents, setFilteredEvents] = useState<any[]>();
  const navigation = useNavigation<any>();

  const events = state.loading ? [] : filteredEvents ?? [];

  const onSelecteMonth = useCallback((month: number) => {
    setState((prev) => ({
      ...prev,
      month: MONTHS[month],
      loading: true,
    }));
  }, []);
  const event = useCalendarEvents(state);
  const date = new Date(state.selectedDate!);
  const year = date.toLocaleString("en-US", { year: "numeric" });
  const day = date.getDate();

  const getAppointments = async () => {
    try {
      console.log("here", { day, month: state.month, year });
      setState((prev) => {
        return { ...prev, loading: true, transitionEnd: false };
      });
      const res = await databases.listDocuments(
        DATABASE_ID,
        APPOINTMENT_COLLECTION,
        [
          Query.equal("year", year),
          Query.equal("month", state.month),
          Query.equal("day", day),
        ]
      );
      console.log(res, "appointments");
      setFilteredEvents(res.documents);
    } catch (error) {
      console.log("Error fetching appointments", error);
    } finally {
      setState((prev) => {
        return { ...prev, loading: false, transitionEnd: true };
      });
      setRefresh(false);
    }
  };

  useEffect(() => {
    if (refresh) {
      getAppointments();
    }
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      //setFilteredEvents(event);
      // const date = new Date(state.selectedDate!);
      getAppointments();
      // getAppointments();

      // Result: "December"

      // Using an array of month names
    }, [state.selectedDate, state.month])
  );
  const renderItem = useCallback(
    ({ item, index }: { item: TEvent; index: number }) => {
      return <Event {...item} key={index} />;
    },
    [state.month]
  );

  const selectDate = useCallback((date: Date) => {
    setState((prev) => ({ ...prev, selectedDate: date, loading: true }));
  }, []);

  const stopLoading = useCallback(() => {
    setState((prev) => ({ ...prev, loading: false }));
  }, []);

  useEffect(() => {
    const listener = navigation.addListener("transitionEnd", () => {
      setState((prev) => ({ ...prev, transitionEnd: true }));
    });

    return listener;
  }, []);
  const colorScheme = useColorScheme();

  return (
    <Animated.View style={[styles.container]}>
      <StatusBarManager barStyle={"light"} />
      {/* <Loading loading={state.loading} stopLoading={stopLoading} /> */}

      <>
        <Header
          month={state.month}
          selectedDate={selectDate}
          onSelecteMonth={onSelecteMonth}
        />

        {/* <LoaderOverlay open={state.loading} /> */}

        {state.loading ? (
          <Box width={"100%"} height={"100%"} px={10} py={10}>
            {Array.from({ length: 10 }).map((_, i) => {
              return (
                <Box key={i} my={4}>
                  <Skeleton
                    colorMode={colorScheme === "dark" ? "dark" : "light"}
                    width={"100%"}
                    height={120}
                  />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box width={"100%"} height={"100%"} px={10} py={10}>
            {state.transitionEnd && (
              <Animated.FlatList
                scrollEnabled
                style={styles.container}
                // layout={LinearTransition}
                data={events}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentStyle}
                ListEmptyComponent={
                  <ListEmpty
                    loading={state.loading}
                    selectedDate={state.selectedDate}
                  />
                }
                ListFooterComponent={<Box mb={500} />}
              />
            )}
          </Box>
        )}
      </>
    </Animated.View>
  );
};

export default TaskCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#121212",
  },
  contentStyle: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  padded: {
    padding: 16,
  },
});

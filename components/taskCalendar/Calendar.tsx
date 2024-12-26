import mitt from "mitt";
import { FlatList } from "react-native";
import React, { memo, useCallback, useRef, useEffect, useState } from "react"; // Added useEffect
import { CalendarDayMetadata } from "@marceloterreiro/flash-calendar";
import Animated, {
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";
import { WIDTH } from "@/utils/device";
import WeekDayListItem from "./WeekDayListItem";
import { useCalendarDays } from "./hooks/useCalendarDays";
import WeekEmptyDayListItem from "./WeekEmptyDayListItem";
import { TCalendar, TEmptyDay, TCalendarListItem } from "./types";
import { ANIMATION_DUR, calendarFirstDayOfWeek } from "./constants";
import { setDayEmitter, today } from "./calendarTypes";
import { useFocusEffect } from "expo-router";

const Calendar = memo(
  ({ month, fadeFinished, executeChild, selectedDate }: TCalendar) => {
    const listRef = useRef<FlatList<TEmptyDay | CalendarDayMetadata>>(null);
    const globalSelectedDate = useRef(new Date());
    const days = useCalendarDays(month, calendarFirstDayOfWeek);
    const [today, setToday] = useState(new Date());
    const renderItem = useCallback(
      ({ item: day, index }: TCalendarListItem) => {
        if ("isEmpty" in day) {
          return <WeekEmptyDayListItem key={index} />;
        } else {
          return (
            <WeekDayListItem
              day={day}
              key={index}
              selectedDate={selectedDate}
              globalSelectedDate={globalSelectedDate}
            />
          );
        }
      },
      []
    );
    const scrollToDay = useCallback(() => {
      console.log("scrollToDay called", today.getDate());
      const index = Math.floor(today.getDate() / 8);
      console.log("Calculated index:", index);
      console.log("Target offset:", index * WIDTH);
      if (listRef.current) {
        console.log("FlatList ref exists, attempting to scroll");
        listRef.current.scrollToOffset({
          offset: index * WIDTH,
          animated: true,
        });
      } else {
        console.log("FlatList ref is null");
      }
    }, []);
    // Add immediate scroll attempt when days are loaded
    useFocusEffect(
      useCallback(() => {
        if (days.length > 0) {
          console.log("Days loaded, length:", days.length);
          setTimeout(scrollToDay, ANIMATION_DUR);
        }
      }, [days])
    );
    useAnimatedReaction(
      () => fadeFinished.value,
      (cur, prev) => {
        console.log("Animation reaction - cur:", cur, "prev:", prev);
        if (!prev && cur) {
          console.log("Executing child callback");
          runOnJS(executeChild)(scrollToDay);
        }
      }
    );
    // Let's also try scrolling when the component mounts
    useEffect(() => {
      const timer = setTimeout(scrollToDay, ANIMATION_DUR * 3);
      return () => clearTimeout(timer);
    }, []);
    return (
      <FlatList
        data={days}
        ref={listRef}
        horizontal
        pagingEnabled
        initialNumToRender={7}
        maxToRenderPerBatch={7}
        renderItem={renderItem}
        removeClippedSubviews={false} // Changed this to false
        showsHorizontalScrollIndicator={false}
        updateCellsBatchingPeriod={ANIMATION_DUR / 3}
        onLayout={() => {
          console.log("FlatList layout complete");
          setTimeout(scrollToDay, 100); // Try scrolling after layout
        }}
      />
    );
  }
);
export default Calendar;

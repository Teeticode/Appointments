import { StyleSheet, useColorScheme } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import MainBottomSheet from "@/components/MainBottomSheet";
import Box from "@/components/Box";
import MainText from "@/components/MainText";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import Colors from "@/constants/Colors";
import { height, width } from "@/app/(auth)/landing";
import MainButton from "@/components/MainButton";
import {
  APPOINTMENT_COLLECTION,
  client,
  DATABASE_ID,
  databases,
  SERVICES_COLLECTION,
} from "@/utils/app.write";
import { Databases, Query } from "react-native-appwrite";
import { router, useFocusEffect } from "expo-router";
import userStore from "@/store/user.store";
import useForm from "@/utils/useForm";
import { z } from "zod";
import { FlashMessage } from "@/components/FlashMessage";
import LoaderOverlay from "@/components/LoaderOverlay";
import Icon from "@/components/Icon";
import { Octicons } from "@expo/vector-icons";

export const today = new Date();

const initialState = {
  loading: true,
  month: MONTHS[new Date().getMonth()],
  transitionEnd: false,
  selectedDate: today,
};

export interface Services {
  $collectionId: string;
  $createdAt: Date;
  $databaseId: string;
  $id: string;
  $permissions: any[];
  $updatedAt: Date;
  Name: string;
}

const CreateTaskCalendar = ({ navigation }: TNavigation) => {
  const [state, setState] = React.useState<TCalendarState>(initialState);

  const filteredEvents: any = [];

  const events = state.loading ? [] : filteredEvents ?? [];

  const onSelecteMonth = useCallback((month: number) => {
    setState((prev) => ({
      ...prev,
      month: MONTHS[month],
      loading: true,
    }));
  }, []);

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
  const sheetRef = useRef<BottomSheet>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRef2 = useRef<BottomSheet>(null);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const colorScheme = useColorScheme();
  const times = [
    "9:00-10:00 AM",
    "11:00-12:00 PM",
    "12:00-1:00 PM",
    "2:00-3:00 PM",
    "4:00-5:00 PM",
  ];

  //const services = ["Menicure & Pedicure", "Make up", "Facial"];

  const date = new Date(state.selectedDate!);
  const year = date.toLocaleString("en-US", { year: "numeric" });
  const day = date.getDate();
  const [services, setServices] = useState<Services[]>();

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
    } catch (error) {
      console.log("Error fetching appointments", error);
    } finally {
      setState((prev) => {
        return { ...prev, loading: false, transitionEnd: true };
      });
    }
  };

  const deleteService = async (
    documentId: string,
    databaseId: string,
    collectionId: string
  ) => {
    try {
      setLoading(true);
      const res = await databases.deleteDocument(
        databaseId,
        collectionId,
        documentId
      );
      console.log(res, "deleted service");
      if (res) {
        FlashMessage("Deleted service successfully", "success");
        getServices();
      } else {
        FlashMessage("Failed to delete service, try again!", "danger");
      }
    } catch (error) {
      console.log("Error deleting service", error);
    } finally {
      setLoading(false);
    }
  };
  const getServices = async () => {
    try {
      console.log("here", { day, month: state.month, year });
      setState((prev) => {
        return { ...prev, loading: true, transitionEnd: false };
      });
      const res: any = await databases.listDocuments(
        DATABASE_ID,
        SERVICES_COLLECTION
      );
      console.log(res, "appointments");
      if (res.documents.length > 0) {
        setServices(res.documents);
      }
    } catch (error) {
      console.log("Error fetching appointments", error);
    } finally {
      setState((prev) => {
        return { ...prev, loading: false, transitionEnd: true };
      });
    }
  };
  const [loading, setLoading] = useState(false);
  const { user, phone } = userStore();
  const { getFormValue, setFormValue } = useForm([
    {
      name: "title",
      value: "",
      schema: z.string(),
    },
    {
      name: "time",
      value: "",
      schema: z.string(),
    },
  ]);
  const createApointment = async () => {
    try {
      if (
        getFormValue("title")?.split("")?.length > 0 &&
        getFormValue("time")?.split("")?.length > 0
      ) {
        setLoading(true);

        const databases = new Databases(client);

        const result = await databases.createDocument(
          DATABASE_ID, // databaseId
          APPOINTMENT_COLLECTION, // collectionId
          `${Math.floor(Math.random() * 10000000)}`, // documentId
          {
            title: getFormValue("title"),
            day: day,
            month: state.month,
            year: year,
            name: user.name,
            userid: user.userId,
            time: getFormValue("time"),
          }
        );
        if (result) {
          FlashMessage("Created your appointment successfully", "success");
          router.back();
        } else {
          FlashMessage(
            "Failed to create your appointment, try again!",
            "danger"
          );
        }

        console.log(result);
      } else {
        FlashMessage("Fill in all fields please!", "danger");
      }
    } catch (err) {
      console.log(err);
      FlashMessage("Failed to create your appointment, try again!", "danger");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      //setFilteredEvents(event);
      // const date = new Date(state.selectedDate!);
      getAppointments();
      getServices();
      // getAppointments();

      // Result: "December"

      // Using an array of month names
    }, [state.selectedDate, state.month])
  );

  useEffect(() => {
    //bottomSheetRef.current?.snapToIndex(1);
    console.log(getFormValue("title"), "title");
  }, [getFormValue("title")]);

  return (
    <Animated.View style={[styles.container]}>
      <StatusBarManager barStyle={"light"} />
      {/* <Loading loading={state.loading} stopLoading={stopLoading} /> */}
      <LoaderOverlay open={loading} />
      <>
        <Header
          month={state.month}
          selectedDate={selectDate}
          onSelecteMonth={onSelecteMonth}
          create={true}
        />

        <Box py={20} px={20} width={"100%"} height={"100%"}>
          <Box>
            <MainText>What Service would you like?</MainText>
            <MainButton
              onPress={() => {
                bottomSheetRef.current?.close();
                bottomSheetRef2.current?.snapToIndex(0);
              }}
              mt={10}
              height={60}
            >
              <Box
                width={"100%"}
                height={"100%"}
                justify="center"
                radius={10}
                px={10}
                color={
                  colorScheme === "dark"
                    ? Colors.theme.lightBlack
                    : Colors.theme.lightGray
                }
              >
                <MainText>
                  {getFormValue("title")
                    ? getFormValue("title")
                    : "Select Service"}
                </MainText>
              </Box>
            </MainButton>
          </Box>
          <Box mt={10}>
            <MainText>What time should we slot you in?</MainText>
            <MainButton
              onPress={() => {
                bottomSheetRef2.current?.close();
                bottomSheetRef.current?.expand();
              }}
              mt={10}
              height={60}
            >
              <Box
                width={"100%"}
                height={"100%"}
                justify="center"
                radius={10}
                px={10}
                color={
                  colorScheme === "dark"
                    ? Colors.theme.lightBlack
                    : Colors.theme.lightGray
                }
              >
                <MainText>
                  {getFormValue("time")?.split("")?.length > 0
                    ? getFormValue("time")
                    : "Select Time"}
                </MainText>
              </Box>
            </MainButton>
          </Box>
          <MainButton
            onPress={() => {
              createApointment();
            }}
            mt={40}
            color={Colors.theme.brownish}
            height={50}
          >
            <MainText isHeading color={"#fff"}>
              Schedule your appointment
            </MainText>
          </MainButton>
        </Box>
        <BottomSheet
          ref={bottomSheetRef}
          backgroundStyle={{ backgroundColor: Colors.theme.brownish }}
          snapPoints={["70%"]}
          index={-1}
          enablePanDownToClose={true}
          //  onChange={handleSheetChanges}
        >
          <BottomSheetView
            style={[
              styles.contentContainer,
              { backgroundColor: Colors.theme.brownish, zIndex: 10000 },
            ]}
          >
            <Box mb={30} width={"100%"}>
              <MainText isHeading color={"#fff"}>
                Choose what time you want to start
              </MainText>
            </Box>
            <BottomSheetFlatList
              data={times}
              // scrollEnabled
              keyExtractor={(item) => item}
              renderItem={(time) => {
                return (
                  <MainButton
                    my={5}
                    align="center"
                    justify="center"
                    width={width * 0.8}
                    height={50}
                    onPress={() => {
                      setFormValue("time", time.item);
                      bottomSheetRef.current?.close();
                    }}
                  >
                    <Box
                      align="center"
                      height={50}
                      width={"100%"}
                      justify="center"
                      key={time.index}
                    >
                      <MainText isHeading color={"#666"}>
                        {time.item}
                      </MainText>
                    </Box>
                  </MainButton>
                );
              }}
            />
          </BottomSheetView>
        </BottomSheet>
        <BottomSheet
          ref={bottomSheetRef2}
          backgroundStyle={{ backgroundColor: Colors.theme.brownish }}
          snapPoints={["60%"]}
          index={-1}
          //onMagicTap={() => bottomSheetRef2.current?.close()}
          enablePanDownToClose={true}
          //containerStyle={{ backgroundColor: "red" }}
          onClose={() => bottomSheetRef2.current?.close()}
          //  onChange={handleSheetChanges}
        >
          <BottomSheetView
            style={[
              styles.contentContainer,
              { backgroundColor: Colors.theme.brownish },
            ]}
          >
            <Box mb={30} width={"100%"}>
              <MainText isHeading color={"#fff"}>
                Choose the service you want
              </MainText>
            </Box>
            <BottomSheetFlatList
              data={services}
              // scrollEnabled
              keyExtractor={(item) => item?.$createdAt.toString()}
              renderItem={(service) => {
                return (
                  <MainButton
                    key={`${service.item.$createdAt}`}
                    my={5}
                    align="center"
                    justify="center"
                    width={width * 0.8}
                    height={50}
                    onPress={() => {
                      setFormValue("title", service.item.Name);
                      bottomSheetRef2.current?.close();
                    }}
                  >
                    <Box
                      align="center"
                      height={50}
                      justify={
                        phone === "706828787" || phone === "722353882"
                          ? "space-between"
                          : "center"
                      }
                      px={20}
                      width={"100%"}
                      direction="row"
                      key={service.index}
                    >
                      <MainText isHeading color={"#666"}>
                        {service.item.Name}
                      </MainText>
                      {(phone === "706828787" || phone === "722353882") && (
                        <Octicons
                          color="#666"
                          name={"trash"}
                          size={25}
                          onPress={() => {
                            console.log(service.item.Name);
                            deleteService(
                              service.item.$id,
                              service.item.$databaseId,
                              service.item.$collectionId
                            );
                          }}
                        />
                      )}
                    </Box>
                  </MainButton>
                );
              }}
            />
          </BottomSheetView>
        </BottomSheet>
        {/* <Animated.FlatList
          style={styles.container}
          layout={LinearTransition}
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
        /> */}
      </>
    </Animated.View>
  );
};

export default CreateTaskCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#121212",
  },
  contentStyle: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
    backgroundColor: "red",
    width: width,
    height: height,
  },
});

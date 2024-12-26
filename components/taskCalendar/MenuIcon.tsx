import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { memo, useRef } from "react";
import { Image, StyleSheet, View } from "react-native";
import AvatarModal from "../AvatarModal";
import MainText from "../MainText";
import Box from "../Box";
import userStore from "@/store/user.store";
import user1 from "@/assets/animation/user1.json";
import user2 from "@/assets/animation/user2.json";
import user3 from "@/assets/animation/user3.json";
import user4 from "@/assets/animation/user4.json";
import user5 from "@/assets/animation/user5.json";
import user6 from "@/assets/animation/user6.json";
import LottieView from "lottie-react-native";
import MainButton from "../MainButton";
import BackHeader from "../BackHeader";
import { DATABASE_ID, databases, USER_COLLECTION } from "@/utils/app.write";
import { Query } from "react-native-appwrite";
import { FlashMessage } from "../FlashMessage";
import LoaderOverlay from "../LoaderOverlay";
type Props = {
  create: boolean;
};
const MenuIcon = memo(({ create }: Props) => {
  const [open, setOpen] = React.useState(false);
  const { user, setUser } = userStore();

  const animations = [user1, user2, user3, user5];
  const animationRef = useRef<LottieView>(null);
  const [loading, setLoading] = React.useState(false);

  const saveProfile = async (id: number) => {
    try {
      setLoading(true);
      setOpen(false);
      const userData = await databases.listDocuments(
        DATABASE_ID,
        USER_COLLECTION,
        [Query.equal("phoneNumber", user.phone)]
      );
      const res = await databases.updateDocument(
        DATABASE_ID, // databaseId
        USER_COLLECTION, // collectionId
        userData.documents[0].$id, // documentId
        { profile: id } // data (optional)
      );
      if (res) {
        FlashMessage("Profile saved successfully", "success");
        setUser({
          name: user.name,
          userId: user.userId,
          phone: user.phone,
          profile: id,
        });
      }
    } catch (e) {
      console.log("Error saving profile: ", e);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Feather
        onPress={() => router.push("/(tabs)/home/create")}
        name="plus-circle"
        size={24}
        color="white"
      /> */}
      <LoaderOverlay open={loading} />
      <Box>
        {create ? (
          <BackHeader create={true} />
        ) : (
          <MainText color={"#fff"} size={"xl"} isHeading>
            Hello, {user?.name?.split(" ")[0]}
          </MainText>
        )}
      </Box>
      {/* <Image
        source={{ uri: "https://randomuser.me/api/portraits/men/44.jpg" }}
        style={styles.img}
      /> */}
      {user?.profile && (
        <MainButton onPress={() => setOpen(true)} color="transparent">
          <LottieView
            //duration={5000}

            autoPlay
            loop={true}
            //ref={animationRef}
            resizeMode="cover"
            style={{
              width: 80,
              height: 80,
              marginHorizontal: 10,
              padding: 5,

              //   backgroundColor: Colors.theme.lightPink,
            }}
            source={animations[user?.profile - 1]}
          />
        </MainButton>
      )}

      <AvatarModal saving={saveProfile} open={open} setOpen={setOpen} />
    </View>
  );
});

export default MenuIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    justifyContent: "space-between",
    marginTop: 10,
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "white",
  },
});

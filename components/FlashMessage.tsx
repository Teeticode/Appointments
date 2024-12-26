import Colors from "@/constants/Colors";
import { MessageType, showMessage } from "react-native-flash-message";

import { moderateScale } from "react-native-size-matters";

export const FlashMessage = (
  message: string,
  type: MessageType | undefined,
  description?: string | undefined
) =>
  showMessage({
    message: message,
    type: type,
    icon: type,
    description: description,
    duration: 3000,
    floating: true,
    position: "top",
    animated: true,
    style: {
      borderRadius: moderateScale(20),
      marginTop: moderateScale(50),
      padding: moderateScale(10),
    },
    titleStyle: {
      color: Colors.dark.text,
      fontFamily: "Nunito_500Medium",
      marginHorizontal: moderateScale(10),
    },
  });

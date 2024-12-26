import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";
import React from "react";
import Colors from "@/constants/Colors";

export default function Icon({
  name,
  color,
  size = "md",
  source = "Feather",
}: IconProps) {
  const iconSize = () => {
    if (typeof size === "string") {
      return iconSizes.find((options) => options.size === size)!.value;
    } else {
      return size;
    }
  };

  return (
    <>
      {source === "Feather" && (
        <Feather
          name={name as keyof typeof Feather.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "AntDesign" && (
        <AntDesign
          name={name as keyof typeof AntDesign.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "Entypo" && (
        <Entypo
          name={name as keyof typeof Entypo.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "EvilIcons" && (
        <EvilIcons
          name={name as keyof typeof EvilIcons.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "FontAwesome" && (
        <FontAwesome
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "FontAwesome5" && (
        <FontAwesome5
          name={name as keyof typeof FontAwesome.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "Fontisto" && (
        <Fontisto
          name={name as keyof typeof Fontisto.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "Foundation" && (
        <Foundation
          name={name as keyof typeof Foundation.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "Ionicons" && (
        <Ionicons
          name={name as keyof typeof Ionicons.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "MaterialCommunityIcons" && (
        <MaterialCommunityIcons
          name={name as keyof typeof MaterialCommunityIcons.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "MaterialIcons" && (
        <MaterialIcons
          name={name as keyof typeof MaterialIcons.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "Octicons" && (
        <Octicons
          name={name as keyof typeof Octicons.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "SimpleLineIcons" && (
        <SimpleLineIcons
          name={name as keyof typeof SimpleLineIcons.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
      {source === "Zocial" && (
        <Zocial
          name={name as keyof typeof Zocial.glyphMap}
          size={iconSize()}
          color={color ? color : Colors.light.text}
        />
      )}
    </>
  );
}

export interface IconProps {
  source?:
    | "AntDesign"
    | "Entypo"
    | "EvilIcons"
    | "Feather"
    | "FontAwesome"
    | "FontAwesome5"
    | "Fontisto"
    | "Foundation"
    | "Ionicons"
    | "MaterialCommunityIcons"
    | "MaterialIcons"
    | "Octicons"
    | "SimpleLineIcons"
    | "Zocial";
  name:
    | keyof typeof Feather.glyphMap
    | keyof typeof AntDesign.glyphMap
    | keyof typeof Entypo.glyphMap
    | keyof typeof EvilIcons.glyphMap
    | keyof typeof FontAwesome.glyphMap
    | keyof typeof Fontisto.glyphMap
    | keyof typeof Foundation.glyphMap
    | keyof typeof Ionicons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap
    | keyof typeof MaterialCommunityIcons.glyphMap
    | keyof typeof MaterialIcons.glyphMap
    | keyof typeof Octicons.glyphMap
    | keyof typeof SimpleLineIcons.glyphMap
    | keyof typeof Zocial.glyphMap
    | keyof typeof FontAwesome5.glyphMap;
  size?: number | TextSize;
  color?: string;
}

const iconSizes = [
  { size: "xxxs", value: 10 },
  { size: "xxs", value: 12 },
  { size: "xs", value: 14 },
  { size: "sm", value: 16 },
  { size: "md", value: 18 },
  { size: "lg", value: 20 },
  { size: "xl", value: 22 },
  { size: "xxl", value: 24 },
  { size: "xxxl", value: 26 },
] as const;

type TextSize = (typeof iconSizes)[number]["size"];

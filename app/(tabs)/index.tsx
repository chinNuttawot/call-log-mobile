import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  SafeAreaView,
  View,
  Clipboard,
  Alert,
} from "react-native";
import { Fragment, useEffect, useState } from "react";
import CallLogs from "react-native-call-log";
import { StatusBar } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ThemedView } from "@/components/ThemedView";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import mockup from "../mockup/mockup";
import PropsDataCalling from "./interface";

export default function HomeScreen() {
  const [text, setText] = useState("");
  const [dataCalling, setDataCalling] = useState([] as PropsDataCalling[]);
  const [granted, setGranted] = useState("");

  useEffect(() => {
    getDataCalling();
    _PermissionsAndroid();
  });
  const _PermissionsAndroid = async () => {
    try {
      const _granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
        {
          title: "Call Log Example",
          message: "Access your call logs",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      setGranted(_granted);
    } catch (e) {
      setText(JSON.stringify(e));
    }
  };
  const getDataCalling = () => {
    setDataCalling(mockup.dataCall);
  };
  const onTouchableOpacity = async () => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      CallLogs.load(99999999).then((c: any) => {
        setText(`${JSON.stringify(c)}`);
      });
    } else {
      _PermissionsAndroid();
      setText("Call Log permission denied");
    }
  };
  const copyToClipboard = () => {
    Clipboard.setString(text);
    Alert.alert("คัดลอกแล้ว!", "ข้อความถูกคัดลอกไปยังคลิปบอร์ดแล้ว");
  };
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };
  const RenderCalling = () => {
    return dataCalling.map((v, k) => {
      const date = formatDate(Number(v.timestamp));
      return (
        <View key={k}>
          <ThemedText type="defaultSemiBold">
            {v.type === "UNKNOWN" ? "ไม่รู้จัก" : v.phoneNumber}
          </ThemedText>
          <ThemedText>{date}</ThemedText>
        </View>
      );
    });
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#0288d1", dark: "#0288d1" }}
      headerImage={<View />}
    >
      <TouchableOpacity
        onPress={() => onTouchableOpacity()}
        style={styles.titleContainer}
      >
        <ThemedText>Open Log</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => copyToClipboard()}
        style={styles.titleContainer}
      >
        <ThemedText>Copy Log</ThemedText>
      </TouchableOpacity>
      <ThemedText>{text}</ThemedText>
      {/* {RenderCalling()} */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {},
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});

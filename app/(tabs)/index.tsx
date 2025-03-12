import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
} from "react-native";
import { useEffect, useState } from "react";
import CallLogs from "react-native-call-log";

export default function HomeScreen() {
  const [text, setText] = useState("");
  const [granted, setGranted] = useState("");

  useEffect(() => {
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
  const onTouchableOpacity = async () => {
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      CallLogs.load(5).then((c: any) => {
        setText(`onTouchableOpacity : \n${JSON.stringify(c)}`);
      });
    } else {
      _PermissionsAndroid()
      setText("Call Log permission denied");
    }
  };
  return (
    <>
      <TouchableOpacity onPress={() => onTouchableOpacity()}>
        <Text>open log</Text>
      </TouchableOpacity>
      <Text>{text}</Text>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
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

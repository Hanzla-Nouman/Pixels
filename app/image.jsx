// import { theme } from "@/constants/theme";
// import * as FileSystem from "expo-file-system";
// import { hp, wp } from "@/helpers/common";
// import { Octicons } from "@expo/vector-icons";
// import { BlurView } from "expo-blur";
// import { Image } from "expo-image";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import React, { useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Button,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from "react-native";
// import Animated, { FadeInDown } from "react-native-reanimated";

// const image = () => {
//   const router = useRouter();
//   const item = useLocalSearchParams();
//   const [status, setStatus] = useState("");
//   let uri = item?.webformatURL;
//   const fileName = item?.previewURL?.split("/").pop();
//   const imageUrl = uri;
//   const filePath = `${FileSystem.documentDirectory}${fileName}`;
//   console.log("Upper NAme",fileName)
//   console.log("Upper2",item?.previewURL?.split("/"))
//   console.log("Upper",filePath)
//   const onLoad = () => {
//     setStatus("loaded");
//   };
//   const getSize = () => {
//     const aspectRatio = item?.imageWidth / item?.imageHeight;
//     const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
//     let calculatedHeight = maxWidth / aspectRatio;
//     let calculatedWidth = maxWidth;
//     if (aspectRatio < 1) {
//       calculatedWidth = calculatedHeight * aspectRatio;
//     }
//     return {
//       width: calculatedWidth,
//       height: calculatedHeight,
//     };
//   };
//   const handleDownload = async () => {
//     setStatus("downloading");
//     let uri = await downloadFile();
//     if (uri) console.log("Download", uri);
//   };
//   const handleShare = () => {};
//   const downloadFile = async () => {
//     try {
//       const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
//       setStatus("");
//       console.log("imageUrl at", imageUrl);
//       console.log("filePath at", filePath);
//       console.log("downloaded at", uri);
//       return uri;
//     } catch (error) {
//       console.log("error", error);
//       setStatus("");
//       Alert.alert("Image", error.message);
//       return null;
//     }
//   };
//   return (
//     <BlurView
//       tint="dark"
//       intensity={100}
//       experimentalBlurMethod="none"
//       style={styles.container}
//     >
//       <View style={[]}>
//         <Image
//           transition={100}
//           source={uri}
//           style={[styles.image, getSize()]}
//           onLoad={onLoad}
//         ></Image>
//       </View>
//       <View style={styles.buttons}>
//         <Animated.View entering={FadeInDown.springify()}>
//           <Pressable style={styles.button} onPress={() => router.back()}>
//             <Octicons name="x" size={24} color={"white"} />
//           </Pressable>
//         </Animated.View>
//         <Animated.View entering={FadeInDown.springify().delay(100)}>
//           {status === "downloading" ? (
//             <View style={styles.button}>
//               <ActivityIndicator size={"small"} color="white" />
//             </View>
//           ) : (
//             <Pressable style={styles.button} onPress={handleDownload}>
//               <Octicons name="download" size={24} color={"white"} />
//             </Pressable>
//           )}
//         </Animated.View>
//         <Animated.View entering={FadeInDown.springify().delay(200)}>
//           <Pressable style={styles.button} onPress={handleShare}>
//             <Octicons name="share" size={24} color={"white"} />
//           </Pressable>
//         </Animated.View>
//       </View>
//     </BlurView>
//   );
// };

// export default image;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: wp(4),
//   },
//   image: {
//     borderRadius: theme.radius.lg,
//     borderWidth: 2,
//     borderColor: "rgba(255,255,255,0.1)",
//     backgroundColor: "rgba(255,255,255,0.1)",
//   },
//   buttons: {
//     marginTop: 40,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 50,
//   },
//   button: {
//     height: hp(6),
//     width: hp(6),
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(255,255,255,0.4)",
//     borderRadius: theme.radius.lg,
//     borderCurve: "continuous",
//   },
// });
import React, { useState } from "react";
import { Alert, Button, View, Platform, Pressable, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";
import { Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { BlurView } from "expo-blur";
import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Sharing from 'expo-sharing';
import Toast from 'react-native-toast-message'
const ImageComponent = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState("");

  const imageUrl = item?.webformatURL;
  const fileName = item?.previewURL?.split("/").pop();
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  const onLoad = () => setStatus("loaded");

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;
    const maxWidth = Platform.OS === "web" ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;
    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return { width: calculatedWidth, height: calculatedHeight };
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      setStatus("");
      // console.log("imageUrl at", imageUrl);
      // console.log("filePath at", filePath);
      // console.log("downloaded at", uri);
      return uri;
    } catch (error) {
      console.log("error", error);
      setStatus("");
      Alert.alert("Image Download Failed", error.message);
      return null;
    }
  };
  const filePaths = `${FileSystem.documentDirectory}bird-8788491_150.jpg`;
// console.log("=============",filePaths)
 
  const handleDownload = async () => {
    setStatus("downloading");
    const uri = await downloadFile();
    if (uri) showToast("Image downloaded")

  };
  
  const handleShare = async () => {
    const uri = await downloadFile();
    setStatus("sharing");
    if (uri) {await Sharing.shareAsync(uri)}
    setStatus("");
    
  };
  const showToast = (message)=>{
    Toast.show({
      type:"success",
      text1: message,
      position:"bottom"
    });
  }
  const toastConfig ={
   success:({text1,props,...rest})=>(
     <View style={styles.toast}>
      <Text style={styles.toastText}>{text1}</Text>
     </View>
   )
  }
  return (
    <>
    <BlurView tint="dark" intensity={100} style={styles.container}>
      <View style={[]}>
        <Image
          transition={100}
          source={{ uri: imageUrl }}
          style={[styles.image, getSize()]}
          onLoad={onLoad}
        />
       
   
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === "downloading" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownload}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
        {status === "sharing" ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShare}>
            <Octicons name="share" size={24} color="white" />
          </Pressable>
          )}
        </Animated.View>
      </View>
    </BlurView>
          <Toast config={toastConfig} visibilityTime={2500}/>
    </>
  );
};

export default ImageComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  buttons: {
    marginTop: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.4)",
    borderRadius: theme.radius.lg,
  },toast:{
    padding: 15,
    paddingHorizontal:30,
    borderRadius: theme.radius.xl,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: 'rgba(255,255,255,0.15)'
  },toastText:{
     fontSize: hp(1.8),
     fontWeight: "bold",
     color: "white",
  }
});

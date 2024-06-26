import React from "react";
import { Image } from "expo-image";
import {  Pressable, StyleSheet, Text, View } from "react-native";
import { getImageSize, wp } from "@/helpers/common";
import { theme } from "@/constants/theme";
const ImageCard = ({ router, item, index ,columns}) => {
    const getImageHeight=()=>{
       let {imageHeight: height, imageWidth:width} = item
       return {height: getImageSize(height,width)}
    }
    const isLastinRow = ()=>{
        return (index + 1) % columns === 0;
    }
  return (
    <View>
      <Pressable onPress={()=> router.push({pathname:'image',params:{...item}})} style={[styles.imageWrapper,!isLastinRow() && styles.spacing ]}>
        <Image style={[styles.image,getImageHeight()]} source={{ uri: item?.webformatURL }} transition={100} />
      </Pressable>
    </View>
  );
};  
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 300
  },
  imageWrapper:{
    backgroundColor: theme.colors.grayBg,
    borderRadius: theme.radius.xl,
    overflow:'hidden',
    marginBottom: wp(2),
    borderCurve:"continous"
  },spacing:{
    marginRight: wp(2)
  } 
});
export default ImageCard;
  
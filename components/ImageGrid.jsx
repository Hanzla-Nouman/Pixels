import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "../components/ImageCard";
import { getColumnsCount, wp } from "@/helpers/common";
const ImageGrid = ({ images,router }) => {
  const columns = getColumnsCount();
  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <ImageCard router={router} item={item} index={index} columns={columns}/>
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainer: {
    paddingHorizontal: wp(4),
  },
});
export default ImageGrid;

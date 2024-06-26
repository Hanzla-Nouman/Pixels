import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { captilize, hp } from "@/helpers/common";
import { theme } from "@/constants/theme";
import { ColorFilter, CommonFilterView, SectionView } from "./FilterView";
import { data } from "@/constants/data";
import Animated, { FadeInDown } from "react-native-reanimated";

const FiltersModal = ({
  modalRef,
  filter,
  setfilter,
  onClose,
  onApply,
  onReset,
}) => {
  const snapPoints = useMemo(() => ["75%"], []);
  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backdropComponent={customBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Filters</Text>
          {Object.keys(sections).map((sectionName, index) => {
            let sectionView = sections[sectionName];
            let sectionData = data.filters[sectionName];
            let title = captilize(sectionName); 
            return (
              <Animated.View entering={FadeInDown.delay((index*100)+100).springify().damping(11)} key={sectionName}>
                <SectionView
                  title={title} 
                  content={sectionView({ 
                    data: sectionData,
                    filter,
                    setfilter,
                    filterName: sectionName,
                  })}
                />
              </Animated.View>
            );
          })}
          <Animated.View entering={FadeInDown.delay(500).springify().damping(11)} style={styles.buttons}>
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
const sections = {
  order: (props) => <CommonFilterView {...props} />,
  orientation: (props) => <CommonFilterView {...props} />,
  type: (props) => <CommonFilterView {...props} />,
  colors: (props) => <ColorFilter {...props} />,
};

const customBackdrop = ({ animatedIndex, style }) => {
  const containerStyle = [StyleSheet.absoluteFill, style, styles.overlay];
  return (
    <View style={containerStyle}>
      <BlurView intensity="10" tint="dark" style={StyleSheet.absoluteFill} />
    </View>
  );
};
export default FiltersModal;

const styles = StyleSheet.create({
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 10,
    // width: "100%",
    // flex: 1,
    // backgroundColor: "red",
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.neutral(0.9),
    marginBottom: 5,
  },
  buttons: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  applyButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.8),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
  },
  resetButton: {
    flex: 1,
    backgroundColor: theme.colors.neutral(0.03),
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral(0.9),
  },
  buttonText:{
    fontSize: hp(2)
  }
});

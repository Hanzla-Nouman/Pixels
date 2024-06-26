import { theme } from "@/constants/theme";
import { hp, wp } from "@/helpers/common";
import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import ImageGrid from "../components/ImageGrid";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getPictures } from "../app/api/index";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Categories from "../components/Categories";
import { debounce } from "lodash";
import FiltersModal from "@/components/FiltersModal";
import { useRouter } from "expo-router";

var page = 1;
const home = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 20 : 30;
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(null);
  const [filter, setfilter] = useState(null);
  const [isEndReached, setisEndReached] = useState(false);
  const searchInputRef = useRef(null);
  const modalRef = useRef(null);
  const scrollRef = useRef(null);
  const router = useRouter()

  const [images, setImages] = useState([]);
  const handleCategory = (cat) => {
    setCategory(cat);
    clearSearch();
    setImages([]);
    page = 1;
    let params = {
      page,
      ...filter,
    };
    if (cat) params.category = cat;
    fetchImages(params, false);
  };
  useEffect(() => {
    fetchImages();
  }, []);
  const fetchImages = async (params = { page: 1 }, append = true) => {
    let res = await getPictures(params);
    if (res.success && res?.data?.hits) {
      if (append) setImages([...images, ...res.data.hits]);
      else setImages([...res.data.hits]);
    }
  };
  const handleSearch = (text) => {
    setCategory(null);

    setSearch(text);
    if (text.length > 2) {
      setImages([]);
      fetchImages({ page, q: text, ...filter }, false);
    }
    if (text == "") {
      page = 1;
      searchInputRef?.current?.clear();
      setImages([]);
      fetchImages({ page, ...filter }, false);
    }
  };
  const clearSearch = (text) => {
    setSearch(text);
    searchInputRef?.current?.clear();
  };
  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;
    if (scrollOffset >= bottomPosition - 1) {
      if(!isEndReached){
setisEndReached(true)
        // console.log("reached");
      }
      ++page;
      let params = {
        page,
        ...filter,
      };
      if (category) params.category = category;
      if (search) params.q = search;
      fetchImages(params);
    }
  };

  const openFilterModal = () => {
    modalRef?.current?.present();
  };
  const closeFilterModal = () => {
    modalRef?.current?.close();
  };
  const applyFilters = () => {
    if (filter) {
      page = 1;
      setImages([]);
      let params = {
        page,
        ...filter,
      };
      if (category) params.category = category;
      if (search) params.q = search;
      fetchImages(params, false);
    }

    // console.log("applyFilters");
    closeFilterModal();
  };
  const clearThisFilter = (filterName) => {
    // Create a new object excluding the specified key using the spread operator and filtering
    const filterz = Object.keys(filter)
      .filter((key) => key !== filterName)
      .reduce((acc, key) => {
        acc[key] = filter[key];
        return acc;
      }, {});

    // Update the state and parameters
    setfilter(filterz);
    page = 1;
    setImages([]);

    let params = {
      page,
      ...filterz,
    };

    if (category) params.category = category;
    if (search) params.q = search;

    fetchImages(params, false);
  };
  const resetFilters = () => {
    if (filter) {
      page = 1;
      setfilter(null);
      setImages([]);
      let params = {
        page,
      };
      if (category) params.category = category;
      if (search) params.q = search;
      fetchImages(params, false);
    }
    closeFilterModal();
  };
  const handleTextDebounce = useCallback(debounce(handleSearch, 400), []);
  return (
    <>
      <StatusBar barStyle={"dark-content"} />
      <View style={[{ paddingTop }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <Pressable
            onPress={() =>
              scrollRef.current.scrollTo({
                y: 0,
                animated: true,
              })
            }
          >
            <Text style={styles.title}>Pixels</Text>
          </Pressable>
          <Pressable onPress={openFilterModal}>
            <FontAwesome6
              name="bars-staggered"
              size={22}
              color={theme.colors.neutral(0.7)}
            />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={{ gap: 15 }}
          overScrollMode="never"
          onScroll={handleScroll}
          scrollEventThrottle={5}
          ref={scrollRef}
        >
          {/* SEARCH BAR */}
          <View style={styles.searchBar}>
            <View style={styles.searchIcon}>
              <Feather
                name="search"
                size={24}
                color={theme.colors.neutral(0.4)}
              />
            </View>
            <TextInput
              placeholder="Search for photos..."
              style={styles.searchInput}
              onChangeText={handleTextDebounce}
              ref={searchInputRef}
            />

            {search && (
              <Pressable
                onPress={() => handleSearch("")}
                style={styles.closeIcon}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={theme.colors.neutral(0.6)}
                />
              </Pressable>
            )}
          </View>
          <Categories category={category} handleCategory={handleCategory} />
          {/* <View style={styles.filter}> */}
          {filter && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filter}
            >
              {Object.keys(filter).map((key, index) => {
                return (
                  <View key={index} style={styles.filterItem}>
                    {key === "colors" ? (
                      <View
                        style={{
                          height: 25,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filter[key],
                        }}
                      ></View>
                    ) : (
                      <Text style={styles.filterText}>{filter[key]}</Text>
                    )}

                    <Pressable
                      onPress={() => clearThisFilter(key)}
                      style={styles.filterCloseIcon}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          )}
          <View>{images.length > 0 && <ImageGrid images={images} router={router} />}</View>
          <View
            style={{
              marginBottom: 100,
              marginTop: images.length > 0 ? 70 : 70,
            }}
          >
            <ActivityIndicator size={"large"} />
          </View>
        </ScrollView>
        <FiltersModal
          modalRef={modalRef}
          filter={filter}
          setfilter={setfilter}
          onClose={closeFilterModal}
          onApply={applyFilters}
          onReset={resetFilters}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: wp(4),
  },
  title: {
    fontSize: hp(4),
    fontWeight: "bold",
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    marginTop: hp(1.2),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: 6,
    paddingLeft: 10,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.grayBg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: hp(2),
    paddingVertical: 10,
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  filter: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBg,
    padding: 3,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    padding: 8,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterText: {
    fontSize: hp(1.8),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});

export default home;

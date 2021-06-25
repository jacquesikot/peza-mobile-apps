/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Image as RNImage, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Feather as Icon } from '@expo/vector-icons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import * as Linking from 'expo-linking';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import Toast from 'react-native-toast-message';

import { Box, theme, Text } from '../../components';
import { ListingImgSlider } from '../../components/ListingImgSlider';
import { StackHeader } from '../../components/StackHeader';
import { HomeNavParamList } from '../../types/navigation.types';
import agentsApi from '../../firebase/agent';
import { IListingFavorite } from '../../types/listing.type';
import { removeFavorite, addFavorite } from '../../redux/actions';
import authApi from '../../firebase/auth';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingBottom: 100,
  },
  imgSlider: {
    position: 'absolute',
  },
  lowerContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'relative',
    marginTop: hp(45),
    padding: theme.constants.screenPadding / 2,
    backgroundColor: theme.colors.white,
  },
  title: {
    marginLeft: theme.constants.screenPadding / 2,
    position: 'absolute',
    top: hp(35),
  },
  addressContainer: {
    flexDirection: 'row',
    width: theme.constants.screenWidth,
    alignItems: 'center',
    marginTop: hp(1),
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -30,
  },
  displayImg: {
    width: wp(12),
    height: wp(12),
    backgroundColor: theme.colors.dark,
    borderRadius: wp(6),
    marginRight: wp(5),
  },
  asking: {},
  propertyDetail: {
    marginTop: hp(3),
  },
  amenities: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(3),
    marginBottom: hp(3),
  },
  contactContainer: {
    bottom: hp(15),
    left: hp(2),
    position: 'absolute',
    flexDirection: 'row',
    width: wp(25),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactItem: {
    backgroundColor: theme.colors.secondary,
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
    top: hp(14),
    left: wp(60),
  },
  amenityTab: {
    width: 95,
    height: 48,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 12,
    marginVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 16,
  },
  amenityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: theme.constants.screenWidth,
  },
});

const listingDetail = ({
  route,
  navigation,
}: StackScreenProps<HomeNavParamList, 'ListingDetail'>) => {
  const {
    images,
    title,
    address,
    price,
    rooms,
    baths,
    area,
    agent_id,
    type,
    furnish,
    address_area,
    property_type,
    description,
    build_year,
  } = route.params.listing;

  const WHATSAPP_MESSAGE = encodeURI(
    `Hello from Peza, I would like to know more about your property ${
      type === 'for_rent' ? 'for rent' : 'for sale'
    } at ${address} going for ZK ${Intl.NumberFormat('en-US').format(price)}.`,
  );

  const [data, setData] = useState<any[]>([]);
  const [adminUser, setAdminUser] = useState();

  const user = firebase.auth().currentUser;

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const { favorites } = useSelector((state: any) => state.favoriteReducer);

  const dispatch = useDispatch();

  const removeFromFavorite = (favorite: IListingFavorite) => {
    dispatch(removeFavorite(favorite));
  };

  const addToFavorite = (favorite: IListingFavorite) => {
    dispatch(addFavorite(favorite));
  };

  const handleFavorite = (listingToAdd: any) => {
    try {
      const newFav = {
        ...listingToAdd,
      };

      delete newFav.id;

      const fav: IListingFavorite = {
        ...newFav,
        user_id: user ? user.uid : '',
        product_id: route.params.listing.id,
      };

      if (isFavorite) {
        const fav = favorites.filter(
          (f: IListingFavorite) => f.product_id == route.params.listing.id,
        );
        removeFromFavorite(fav[0]);
        Toast.show({
          type: 'success',
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          text1: 'Favorites',
          text2: 'Successfully removed from favorites.',
        });
      } else {
        addToFavorite(fav);
        Toast.show({
          type: 'success',
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          text1: 'Favorites',
          text2: 'Successfully added to favorites.',
        });
      }
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        text1: 'Favorites',
        text2: 'Error handling favorite.',
      });
    }
  };

  const isFav = () => {
    const isFav = favorites.some((f: IListingFavorite) => f.product_id === route.params.listing.id);
    isFav && setIsFavorite(true);
  };

  const loadData = async () => {
    const data = await agentsApi.getAgent(agent_id);
    const adminUsers = await authApi.getAdminUsers();
    setAdminUser(adminUsers[0]);
    isFav();
    setData(data);
  };

  useEffect(() => {
    void loadData();
  }, [favorites]);

  return (
    <ScrollView bounces={false} style={styles.container} showsVerticalScrollIndicator={false}>
      <StackHeader
        padding
        onPressBack={() => navigation.goBack()}
        transparent
        bgColor="primary"
        option1={
          user && (
            <TouchableOpacity onPress={() => handleFavorite(route.params.listing)}>
              {isFavorite ? (
                <Icon name="minus-circle" color={theme.colors.white} size={24} />
              ) : (
                <Icon name="plus-circle" color={theme.colors.white} size={24} />
              )}
            </TouchableOpacity>
          )
        }
        onPressOption1={() => handleFavorite(route.params.listing)}
      />

      <Box style={styles.imgSlider}>
        <ListingImgSlider images={images} />
      </Box>

      <Box style={styles.title}>
        <Text variant="h1" color="white">
          {title}
        </Text>

        <Box style={styles.addressContainer}>
          {/* <Icon name="map-pin" color={theme.colors.text} size={24} /> */}
          <Text variant="b1" color="white">
            {address}
          </Text>
        </Box>
      </Box>

      <Box style={styles.lowerContainer}>
        <Box style={styles.topContainer}>
          <Box style={styles.displayImg}>
            <RNImage
              source={require('../../../assets/icon.png')}
              style={{
                width: wp(12),
                height: wp(12),
                borderRadius: wp(6),
                marginRight: wp(5),
              }}
            />
          </Box>
          <Box>
            <Text variant="h3" color="dark" mb="m">
              David Kabati
            </Text>

            <Box style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Box
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: theme.colors.green,
                }}
              />
              <Text variant="b1" color="text" ml="s">
                Available
              </Text>
            </Box>
          </Box>
          <Box style={{ flex: 1 }} />

          <Box style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(`tel:0977944910`)}>
              <Icon name="phone" color={theme.colors.veryLightPurple} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() =>
                Linking.openURL(`https://wa.me/+260977944910?text=${WHATSAPP_MESSAGE}`)
              }>
              <Icon name="message-circle" color={theme.colors.veryLightPurple} size={24} />
            </TouchableOpacity>
          </Box>
        </Box>

        <Box style={styles.propertyDetail}>
          <Box>
            <Text variant="h2B" color="dark">
              Asking
            </Text>
            <Text variant="h2B" color="primary" mt="l">
              {`ZK ${Intl.NumberFormat('en-US').format(price)}`}
            </Text>
          </Box>

          <Text variant="h2B" color="dark" mt="xxl">
            Property detail
          </Text>

          <Box style={styles.amenities}>
            <Box>
              <Text variant="b1" color="lightGrey">
                Bedrooms
              </Text>
              <Text variant="b1B" color="dark" mt="s">
                {rooms}
              </Text>
            </Box>
            <Box>
              <Text variant="b1" color="lightGrey">
                Bathrooms
              </Text>
              <Text variant="b1B" color="dark" mt="s">
                {baths}
              </Text>
            </Box>
            <Box>
              <Text variant="b1" color="lightGrey">
                Area
              </Text>
              <Text variant="b1B" color="dark" mt="s">
                {`${area} m2`}
              </Text>
            </Box>
          </Box>

          <Box>
            <Text numberOfLines={4} variant="h2B" color="dark" mt="l">
              Description
            </Text>

            <Text
              variant="b1"
              color="lightGrey"
              mt="l"
              style={{ alignSelf: 'flex-start', lineHeight: 28 }}>
              {description}
            </Text>

            <Text variant="h2B" color="dark" mt="xxl">
              Amenities
            </Text>

            <Box mt="l" style={styles.amenityContainer}>
              {route.params.listing.amenities.map((a) => (
                <Box style={styles.amenityTab} key={a}>
                  <Text variant="b1" color="white">
                    {a}
                  </Text>
                </Box>
              ))}
            </Box>

            <Text variant="h2B" color="dark" mt="xxl">
              Others
            </Text>

            <Box
              style={{
                flexDirection: 'row',
                width: theme.constants.screenWidth,
                justifyContent: 'space-between',
              }}
              mt="l">
              <Box>
                <Text variant="b1" color="lightGrey">
                  Type
                </Text>
                <Text variant="h3" color="dark" mt="m">
                  {type === 'for_sale' ? 'For Sale' : 'For Rent'}
                </Text>
              </Box>

              <Box>
                <Text variant="b1" color="lightGrey" textAlign="right">
                  Property Type
                </Text>
                <Text variant="h3" color="dark" mt="m" textAlign="right">
                  {property_type}
                </Text>
              </Box>
            </Box>

            <Box
              style={{
                flexDirection: 'row',
                width: theme.constants.screenWidth,
                justifyContent: 'space-between',
              }}
              mt="xxl">
              <Box>
                <Text variant="b1" color="lightGrey">
                  Area
                </Text>
                <Text variant="h3" color="dark" mt="m">
                  {address_area}
                </Text>
              </Box>

              <Box>
                <Text variant="b1" color="lightGrey" textAlign="right">
                  Furnishing
                </Text>
                <Text variant="h3" color="dark" mt="m" textAlign="right">
                  {furnish ? 'Furnished' : 'Not Furnished'}
                </Text>
              </Box>
            </Box>

            <Box
              style={{
                flexDirection: 'row',
                width: theme.constants.screenWidth,
                justifyContent: 'space-between',
              }}
              mt="xxl"
              pb="xxxl">
              <Box>
                <Text variant="b1" color="lightGrey">
                  Build Year
                </Text>
                <Text variant="h3" color="dark" mt="m">
                  {build_year == '' ? 'n/a' : build_year}
                </Text>
              </Box>

              {/* <Box>
              <Text variant="b1" color="lightGrey">
                Furnishing
              </Text>
              <Text variant="h3" color="dark" mt="m">
                {listing.furnish ? 'Furnished' : 'Not Furnished'}
              </Text>
            </Box> */}
            </Box>
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default listingDetail;

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { Feather as Icon } from '@expo/vector-icons';
import { Image } from 'react-native-expo-image-cache';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useQuery } from 'react-query';
import * as Linking from 'expo-linking';
import { useSelector, useDispatch } from 'react-redux';
import firebase from 'firebase';
import Toast from 'react-native-toast-message';

import { Box, theme, Text } from '../../components';
import { ListingImgSlider } from '../../components/ListingImgSlider';
import { StackHeader } from '../../components/StackHeader';
import { HomeNavParamList } from '../../types/navigation.types';
import { Button } from '../../components/Button';
import agentsApi from '../../firebase/agent';
import { IListingFavorite } from '../../types/listing.type';
import listing from '../../firebase/listing';
import { removeFavorite, addFavorite } from '../../redux/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.secondary,
    alignItems: 'center',
  },
  imgSlider: {
    position: 'absolute',
  },
  lowerContainer: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    position: 'absolute',
    top: hp(43),
    padding: theme.constants.screenPadding / 2,
    width: '100%',
    height: '60%',
    backgroundColor: theme.colors.white,
  },
  title: {
    marginLeft: theme.constants.screenPadding / 2,
    position: 'absolute',
    top: hp(25),
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
    marginTop: hp(2),
  },
  amenities: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(2),
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
  favButton: {},
});

const listingDetail = ({
  route,
  navigation,
}: StackScreenProps<HomeNavParamList, 'ListingDetail'>) => {
  const { images, title, address, price, rooms, baths, area, agent_id } = route.params.listing;

  const [data, setData] = useState<any[]>([]);

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

      console.log(fav);

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
    isFav();
    setData(data);
  };

  useEffect(() => {
    void loadData();
    return () => {
      void loadData();
    };
  }, [favorites]);

  return (
    <Box style={styles.container}>
      <StackHeader
        padding
        onPressBack={() => navigation.goBack()}
        transparent
        bgColor="primary"
        option1={
          user && (
            <TouchableOpacity
              onPress={() => handleFavorite(route.params.listing)}
              style={styles.favButton}>
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
            <Image
              {...{ uri: data.length > 0 ? data[0].avatar : '' }}
              style={{
                width: wp(12),
                height: wp(12),
                borderRadius: wp(6),
                marginRight: wp(5),
              }}
              transitionDuration={300}
              tint="dark"
            />
          </Box>
          <Box>
            <Text variant="h3" color="dark" mb="m">
              {data.length > 0 ? data[0].full_name : ''}
            </Text>

            <Text variant="b1" color="text">
              Agent
            </Text>
          </Box>
          <Box style={{ flex: 1 }} />

          <Box style={styles.contactContainer}>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(`tel:${data ? data[0].phone : ''}`)}>
              <Icon name="phone" color={theme.colors.veryLightPurple} size={24} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactItem}
              onPress={() => Linking.openURL(data ? data[0].whatsapp_link : '')}>
              <Icon name="message-circle" color={theme.colors.veryLightPurple} size={24} />
            </TouchableOpacity>
          </Box>
        </Box>

        <Box style={styles.propertyDetail}>
          <Box>
            <Text variant="h2B" color="dark">
              Asking
            </Text>
            <Text variant="h2B" color="green" mt="s">
              {`ZK ${price} K`}
            </Text>
          </Box>

          <Text variant="h2B" color="dark" mt="l">
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

          {/* <Text variant="h2B" color="dark" mt="m">
            Description
          </Text>
          <Text numberOfLines={2} variant="b2" color="lightGrey" lineHeight={25} mt="s" mb="m">
            {description}
          </Text> */}

          <Button
            type="primary"
            label="More details"
            onPress={() =>
              navigation.navigate('ListingDetailExtra', { listing: route.params.listing })
            }
            width={theme.constants.screenWidth}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default listingDetail;

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Feather as Icon } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { View } from 'moti';

import { Box, theme, Text } from '../../components';
import { HomeCard } from '../../components/HomeCard';
import { HomeHeader } from '../../components/HomeHeader';
import { ScreenContainer } from '../../components/Screen';
import { SearchInput } from '../../components/SearchInput';
import { Listing } from '../../components/ListingItem';
import { AgentCard } from '../../components/AgentCard';
import listings from './listingData';
import agentData from './agentData';
import { HomeNavParamList } from '../../types/navigation.types';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.secondary,
  },
  headText: {
    marginTop: hp(4),
    marginBottom: hp(4),
  },
  subHeadText: {
    marginTop: hp(3),
    marginBottom: hp(3),
  },
  cardContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: hp(3),
  },
});

const home = ({ navigation }: StackScreenProps<HomeNavParamList, 'Home'>) => {
  const [active, setActive] = useState<number>(1);

  const data = [
    {
      id: 1,
      icon: (
        <Icon
          name="home"
          color={active === 1 ? theme.colors.yellow : theme.colors.lightGrey}
          size={24}
        />
      ),
      label: 'Homes',
      info: '43',
    },
    {
      id: 2,
      icon: (
        <Icon
          name="user"
          color={active === 2 ? theme.colors.yellow : theme.colors.lightGrey}
          size={24}
        />
      ),
      label: 'Agents',
      info: '22',
    },
  ];

  return (
    <ScreenContainer bgColor="secondary" horizontalPadding>
      {/* <View from={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: 'timing' }}> */}
      <HomeHeader />
      {/* </View> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text variant="h1" color="dark" style={styles.headText}>
          Get your dream property
        </Text>

        <SearchInput placeholder="Search for listings" />

        <Text variant="h2B" color="dark" style={styles.subHeadText}>
          Might help you
        </Text>

        <Box style={styles.cardContainer}>
          {data.map((d) => (
            <TouchableOpacity key={d.id} onPress={() => setActive(d.id)}>
              <HomeCard
                width={wp(42)}
                active={active === d.id ? true : false}
                icon={d.icon}
                label={d.label}
                info={d.info}
              />
            </TouchableOpacity>
          ))}
        </Box>

        <Text variant="h2B" color="dark" style={styles.subHeadText}>
          {active === 1 ? 'Featured Listings' : 'Featured Agents'}
        </Text>

        {active === 1 ? (
          <Box>
            {listings.map((listing) => (
              <Listing
                key={listing.id}
                listing={listing}
                onPressFav={() => alert('Fav pressed!')}
                onPress={() => navigation.navigate('ListingDetail', { listing: listing })}
              />
            ))}
          </Box>
        ) : (
          <Box>
            {agentData.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onPress={() => navigation.navigate('AgentDetail', { agent: agent })}
              />
            ))}
          </Box>
        )}
      </ScrollView>
    </ScreenContainer>
  );
};

export default home;
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { Feather as Icon } from '@expo/vector-icons';
import { Image } from 'react-native-expo-image-cache';
import { useQuery } from 'react-query';
import firebase from 'firebase';

import { Box, theme, Text } from '..';
import IAgent from '../../types/agent.type';
import agentsApi from '../../firebase/agent';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: theme.colors.white,
    height: hp(23),
    borderRadius: wp(6),
    marginBottom: hp(5),
    padding: wp(7),
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
  button: {
    width: wp(12),
    height: wp(12),
    backgroundColor: theme.colors.purple,
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeListing: {
    marginTop: hp(3),
  },
  contactContainer: {
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
});

interface Props {
  agent: IAgent;
  onPress: () => void;
  onPressPhone: () => void;
  onPressMessage: () => void;
}
const AgentCard = ({ agent, onPress, onPressPhone, onPressMessage }: Props) => {
  const user = firebase.auth().currentUser;

  const { data } = useQuery('agentListings', () => agentsApi.getAllAgentListings(user?.uid));

  return (
    <Box style={styles.container}>
      <Box style={styles.topContainer}>
        <Box style={styles.displayImg}>
          <Image
            {...{ uri: agent.avatar }}
            style={{
              width: wp(12),
              height: wp(12),
              borderRadius: wp(6),
              marginRight: wp(5),
            }}
          />
        </Box>
        <Box>
          <Text variant="h2B" color="dark" mb="m">
            {agent.full_name}
          </Text>
          {agent.is_premium && (
            <Text variant="b1" color="text">
              Premium Agent
            </Text>
          )}
        </Box>
        <Box style={{ flex: 1 }} />
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Icon name="arrow-right" color={theme.colors.white} size={28} />
        </TouchableOpacity>
      </Box>
      <Box style={styles.activeListing}>
        <Text variant="h1M" mb="s">
          {data ? data.length : 0}
        </Text>
        <Text variant="b1" color="text">
          Active Listings
        </Text>
      </Box>
      <Box style={styles.contactContainer}>
        <TouchableOpacity onPress={onPressPhone} style={styles.contactItem}>
          <Icon name="phone" color={theme.colors.veryLightPurple} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressMessage} style={styles.contactItem}>
          <Icon name="message-circle" color={theme.colors.veryLightPurple} size={24} />
        </TouchableOpacity>
      </Box>
    </Box>
  );
};

export default AgentCard;

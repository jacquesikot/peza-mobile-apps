/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import firebase from 'firebase';

import firebaseInit from '../firebase';

// import IListing, { IAddListing } from '../types/listing.type';

const db = firebaseInit();

const addListing = async (listing: any) => {
  await db.collection('listing').add(listing);
};

const getAllListings = async () => {
  const data: any[] = [];
  const querySnapshot = await db.collection('listing').get();
  querySnapshot.forEach((doc) => {
    data.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  return data;
};

export default {
  addListing,
  getAllListings,
};

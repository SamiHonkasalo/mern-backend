import axios from 'axios';
import { HttpError } from '../models/http-error';
import config from './config';
const API_KEY = config.MAP_BOX_API;

async function getCoordsForAddress(address: string) {
  let data;
  try {
    const url = 'https://api.mapbox.com/geocoding/v5';
    const endpoint = 'mapbox.places';
    const searchText = encodeURIComponent(address);

    const response = await axios({
      method: 'GET',
      url: `${url}/${endpoint}/${searchText}.json/?access_token=${API_KEY}`,
    });
    data = response.data;
  } catch (e) {
    throw new HttpError('Something went wrong', 500);
  }

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new HttpError(
      'Could not find location for the specified address.',
      404
    );
  }

  const [lng, lat] = data.features[0].center;

  return { lat, lng };
}

export default getCoordsForAddress;

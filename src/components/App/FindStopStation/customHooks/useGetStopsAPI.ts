import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { IStop } from 'globalState/StopStationContext/types/IStop';
import { ILocation } from 'globalState/StopStationContext/types/ILocation';
import { useStopStationContext } from 'globalState';

interface IError {
  title: string;
  message: string;
  isTimeoutError?: boolean;
}

const useGetStopsAPI = (location: ILocation | null, radius: number) => {
  const [results, setResults] = useState<any[]>([]);
  const [, stopStationDispatch] = useStopStationContext();
  const [loading, setLoading] = useState(false); // Set loading state for spinner
  const [errorInfo, setErrorInfo] = useState<IError | null>(null); // Placeholder to set error messaging

  // Reference variables
  const mounted = useRef<any>();
  const source = useRef<any>();
  const apiTimeout = useRef<any>();
  // Helper functions
  const cancelRequest = () => {
    if (source.current) source.current.cancel('Api request timeout');
  };

  const startApiTimeout = useCallback(() => {
    apiTimeout.current = setTimeout(() => {
      cancelRequest();
    }, 15000); // 15 seconds
  }, []);

  const clearApiTimeout = () => clearTimeout(apiTimeout.current);

  const handleApiResponse = useCallback(
    (response) => {
      if (response?.data) {
        const payload = response.data.features.filter(
          (stop: IStop) => stop.properties.type !== 'car-park'
        );
        stopStationDispatch({ type: 'UPDATE_STOPS', payload });
      } else {
        setErrorInfo({
          // Update error message
          title: 'Please try another location',
          message: 'No west midlands stops or stations were found near to your search area',
        });
      }
      clearApiTimeout();
      setLoading(false);
    },
    [stopStationDispatch]
  );

  const handleApiError = (error: any) => {
    setLoading(false); // Set loading state to false after data is received
    setErrorInfo({
      // Update error message
      title: 'Please try again',
      message: 'Apologies, we are having technical difficulties.',
      isTimeoutError: axios.isCancel(error),
    });
    setResults([]); // Reset the results
    if (!axios.isCancel(error)) {
      // eslint-disable-next-line no-console
      console.log({ error });
    }
  };

  // Take main function out of useEffect, so it can be called elsewhere to retry the search
  const getAPIResults = useCallback(() => {
    source.current = axios.CancelToken.source();
    mounted.current = true; // Set mounted to true (used later to make sure we don't do events as component is unmounting)
    const { REACT_APP_API_HOST, REACT_APP_API_KEY } = process.env; // Destructure env vars
    setLoading(true); // Update loading state to true as we are hitting API
    startApiTimeout();
    const { x: longitude, y: latitude } = location!.location;
    const radiusMiles = radius * 1609;
    const options = {
      headers: {
        'Ocp-Apim-Subscription-Key': REACT_APP_API_KEY,
      },
      cancelToken: source.current.token, // Set token with API call, so we can cancel this call on unmount
    };

    axios
      .get(`${REACT_APP_API_HOST}/Stop/v2/Nearest/${latitude}/${longitude}/${radiusMiles}`, options)
      .then((res) => mounted.current && handleApiResponse(res))
      .catch(handleApiError);
  }, [location, radius, handleApiResponse, startApiTimeout]);

  useEffect(() => {
    if (location) {
      getAPIResults();
    }
    // Unmount / cleanup
    return () => {
      mounted.current = false; // Set mounted back to false on unmount
      cancelRequest(); // cancel the request
      clearApiTimeout(); // clear timeout
    };
  }, [getAPIResults, location]);

  return { loading, errorInfo, results, getAPIResults };
};

export default useGetStopsAPI;

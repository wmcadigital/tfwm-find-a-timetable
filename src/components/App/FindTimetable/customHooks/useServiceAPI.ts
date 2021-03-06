import { useEffect, useState, useRef, useCallback } from 'react';
import { useTimetableContext } from 'globalState';
import axios from 'axios';

interface IError {
  title: string;
  message: string;
  isTimeoutError?: boolean;
}

const useServiceAPI = () => {
  const [{ selectedMode, busQuery }] = useTimetableContext();
  const [results, setResults] = useState<any[]>([]);
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

  const handleApiResponse = useCallback((response) => {
    if (response?.data.length > 0) {
      setResults(response.data);
    } else {
      setErrorInfo({
        // Update error message
        title: 'Please try another location',
        message: 'No west midlands bus stops were found near to your search area',
      });
    }
    clearApiTimeout();
    setLoading(false);
  }, []);

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
    setLoading(true); // Update loading state to true as we are hitting API
    startApiTimeout();
    const options = {
      cancelToken: source.current.token, // Set token with API call, so we can cancel this call on unmount
    };

    const apiOptions = {
      path: 'https://journeyplanner.tfwm.org.uk/api/TimetableStopApi/Search/serviceQuery',
      query: {
        SearchString: selectedMode === 'bus' ? busQuery : 'mm1',
        Modes: [`${selectedMode?.charAt(0).toUpperCase}${selectedMode?.slice(1)}`],
      },
    };

    const { path, query } = apiOptions;

    if (selectedMode !== 'rail') {
      if (busQuery.length || selectedMode === 'metro') {
        axios
          .post(path, query, options)
          .then((res) => mounted.current && handleApiResponse(res))
          .catch(handleApiError);
      } else {
        setResults([]);
      }
    }
  }, [handleApiResponse, startApiTimeout, selectedMode, busQuery]);

  useEffect(() => {
    getAPIResults();
    // Unmount / cleanup
    return () => {
      mounted.current = false; // Set mounted back to false on unmount
      cancelRequest(); // cancel the request
      clearApiTimeout(); // clear timeout
    };
  }, [getAPIResults]);

  return { loading, errorInfo, results, getAPIResults };
};

export default useServiceAPI;

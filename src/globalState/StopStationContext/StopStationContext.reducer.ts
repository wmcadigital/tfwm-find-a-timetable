import * as TStopStation from './StopStationContext.types';

// Use an IIFE to define the initial state as we need to check session storage and query params
export const initialState = (() => {
  const state: TStopStation.State = {
    selectedModes: [],
  };

  return state;
})();

export const reducer = (
  state = initialState,
  action: TStopStation.StateAction
): TStopStation.State => {
  switch (action.type) {
    case 'UPDATE_SELECTED_MODES':
      return { ...state, selectedModes: action.payload };
    // Default should return initial state if error
    default:
      return initialState;
  }
};

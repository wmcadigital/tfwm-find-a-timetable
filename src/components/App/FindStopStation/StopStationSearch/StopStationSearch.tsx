import { useStopStationContext } from 'globalState';
import Button from 'components/shared/Button/Button';
import ModeSelect from 'components/shared/ModeSelect/ModeSelect';

const StopStationSearch = () => {
  const [, stopStationDispatch] = useStopStationContext();
  const selectedMode = null;
  const handleSelect = (mode: 'bus' | 'rail' | 'metro') => {
    stopStationDispatch({ type: 'UPDATE_SELECTED_MODE', payload: mode });
  };
  const resetForm = () => {
    console.log('reset');
  };

  return (
    <div className="bg-white wmnds-p-md">
      <div className="wmnds-m-b-md wmnds-text-align-right">
        <Button text="Clear search" onClick={resetForm} btnClass="wmnds-btn--link" />
      </div>
      <ModeSelect
        selectedMode={selectedMode}
        handleSelect={handleSelect}
        classes="wmnds-grid--spacing-3-md"
      />
    </div>
  );
};

export default StopStationSearch;

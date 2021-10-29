import { useState } from 'react';
// Components
import { useStationContext } from 'globalState';
import Button from 'components/shared/Button/Button';
import Icon from 'components/shared/Icon/Icon';
import NearestStops from 'components/shared/Sidebar/NearestStops';
import NIcon from 'components/shared/Icon/NIcon';
import s from '../Stop.module.scss';
import TrainDepartures from '../TrainDepartures/TrainDepartures';
import Map from '../Map/Map';
import railZoneData from '../railZoneData.json';

const Parking = () => {
  return (
    <div className="wmnds-facilities wmnds-bg-white wmnds-p-lg wmnds-m-b-lg">
      <h3 className="wmnds-facilities__title">Park and ride</h3>
      <p className="wmnds-p-t-xsm">
        Owned by <a href="#/">West Midlands Combined Authority</a>
      </p>
      <ul className="wmnds-facilities__list">
        <li className="wmnds-facilities__list-item">
          <Icon iconName="facilities-taxi-rank" className="wmnds-facilities__icon" />
          Spaces: 310
        </li>
      </ul>
      <div className="wmnds-inset-text wmnds-m-b-lg">
        Parking is available on a first come, first served basis
      </div>
      <p>
        West Midlands Combined Authority operates a considerate parking policy to ensure all sites
        are accessible and used in the most appropriate way.
      </p>
      <p className="wmnds-m-b-none">
        Find information on how <a href="#/">Park and Ride</a> works.
      </p>
    </div>
  );
};

const Facilities = () => {
  return (
    <div className="wmnds-facilities wmnds-grid wmnds-grid--spacing-md-2-md wmnds-bg-white wmnds-p-lg wmnds-m-b-lg">
      <div className="wmnds-facilities__section wmnds-col-1-1 wmnds-col-md-1-2">
        <h3 className="wmnds-facilities__title">Station facilities</h3>
        <ul className="wmnds-facilities__list">
          <li className="wmnds-facilities__list-item">
            <Icon iconName="facilities-seating" className="wmnds-facilities__icon" />
            Seated area
          </li>
        </ul>
      </div>
      <div className="wmnds-facilities__section wmnds-col-1-1 wmnds-col-md-1-2">
        <h3 className="wmnds-facilities__title">Accessibility</h3>
        <ul className="wmnds-facilities__list">
          <li className="wmnds-facilities__list-item">
            <Icon iconName="facilities-step-free-access" className="wmnds-facilities__icon" />
            Step-free access
          </li>
        </ul>
      </div>
    </div>
  );
};

const StopInfo = () => {
  const [showMap, setShowMap] = useState(false);
  const [{ stationPoint, stationId }] = useStationContext();
  const station = stationPoint.data[0];
  const zoneInfo = railZoneData.find((railZone: any) => railZone.crsCode === stationId);
  return (
    <div>
      <div className="wmnds-grid wmnds-grid--spacing-md-2-lg">
        <div className="wmnds-col-1 wmnds-col-md-2-3">
          <div className="wmnds-grid wmnds-grid--spacing-2-md wmnds-grid--justify-between">
            <div className="wmnds-col-2-3 wmnds-m-b-lg">
              <h2>
                {station.name}{' '}
                <Icon className={`${s.modeIcon} ${s.train}`} iconName="modes-isolated-rail" />
              </h2>
              {zoneInfo && (
                <h3 className="wmnds-m-t-none">
                  {!zoneInfo.railZone ? (
                    'Out of county'
                  ) : (
                    <>
                      {zoneInfo.railZone === 6 ? (
                        <NIcon str="nTrain zone 5" />
                      ) : (
                        `Rail zone ${zoneInfo.railZone}`
                      )}
                    </>
                  )}
                </h3>
              )}
            </div>
            <div className="wmnds-col-auto">
              <Button
                btnClass="wmnds-btn--secondary wmnds-col-1"
                text={showMap ? 'Hide map' : 'View map'}
                iconRight="general-location-pin"
                onClick={() => setShowMap(!showMap)}
              />
            </div>
          </div>
        </div>
      </div>
      {showMap && <Map />}
      <div className="wmnds-grid wmnds-grid--spacing-md-2-lg">
        <div className="wmnds-col-1 wmnds-col-md-2-3">
          <TrainDepartures />
          <Facilities />
          <Parking />
        </div>
        <div className="wmnds-col-1 wmnds-col-md-1-3">
          <NearestStops lat={station.lat} lon={station.lon} id={stationId} />
        </div>
      </div>
    </div>
  );
};

export default StopInfo;

import busMarker from 'assets/svgs/map/map-marker-bus.svg';
import tramMarker from 'assets/svgs/map/map-marker-metro.svg';
import trainMarker from 'assets/svgs/map/map-marker-rail.svg';
import pinMarker from 'assets/svgs/map/map-marker.svg';

const mapMarker = (mode?: 'bus' | 'tram' | 'train') => {
  switch (mode) {
    case 'bus':
      return busMarker;
    case 'tram':
      return tramMarker;
    case 'train':
      return trainMarker;
    default:
      return pinMarker;
  }
};

export default mapMarker;

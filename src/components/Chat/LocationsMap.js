import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import GPList from '../../da/miscellaneous';
import withReduxStore from '../../utils/withReduxStore';

const postCodeRegEx = /([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})/;

const LocationsMap = (props) => {
  const [markers, setMarkers] = useState([]);
  const [regionState, setRegionState] = useState(null);
  const [postCodeState, setPostCodeState] = useState(props.postCodeLocation);

  function rad2degr(rad) { return rad * 180 / Math.PI; }
  function degr2rad(degr) { return degr * Math.PI / 180; }

  function getLatLngCenter(latLngInDegr) {
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i = 0; i < latLngInDegr.length; i++) {
      var lat = degr2rad(latLngInDegr[i].latitude);
      var lng = degr2rad(latLngInDegr[i].longitude);
      // sum of cartesian coordinates
      sumX += Math.cos(lat) * Math.cos(lng);
      sumY += Math.cos(lat) * Math.sin(lng);
      sumZ += Math.sin(lat);
    }

    var avgX = sumX / latLngInDegr.length;
    var avgY = sumY / latLngInDegr.length;
    var avgZ = sumZ / latLngInDegr.length;

    // convert average x, y, z coordinate to latitude and longtitude
    var lng = Math.atan2(avgY, avgX);
    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    var lat = Math.atan2(avgZ, hyp);

    return { latitude: rad2degr(lat), latitudeDelta: 0.02, longitude: rad2degr(lng), longitudeDelta: 0.02 };
  }

  useEffect(() => {
    GPList.getGPList(postCodeState).then((response) => {
      /* apiPostCodeCoordinates(postCodeState).then((coordinates) => {
        setRegionState(coordinates);
      }); */
      let centerPostCodes = [];
      for (let i = 0; i < 10; i++) {
        const postCode = response[i].Details.match(postCodeRegEx)[0];
        const gpSurgery = {
          Name: response[i].Name,
          Link: 'https://www.nhs.uk' + response[i].Link,
          Details: response[i].Details,
        };
        apiPostCodeCoordinates(postCode).then((res) => {
          res.dateTime = new Date().getTime();
          res.gpSurgery = gpSurgery;
          if (props.bookedGP) {
            if (props.bookedGP === gpSurgery.Name) {
              centerPostCodes.push(res);
              setMarkers(centerPostCodes);
              const center = getLatLngCenter(centerPostCodes)
              setRegionState(center);
            }
          } else {
            centerPostCodes.push(res);
            if (centerPostCodes.length == 10) {
              setMarkers(centerPostCodes);
              const center = getLatLngCenter(centerPostCodes)
              setRegionState(center);
            }
          }
        });
      }
    });
  }, []);

  const apiPostCodeCoordinates = async (postCode) => {
    const config = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/geocode/json?address=${postCode}&key=AIzaSyD32x4jIbGK2BeJbnJXVZ_ACUSmMXo88NQ`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };

    return axios(config).then((response) => {
      const responseData = response.data.results[0].geometry.location;
      return {
        latitude: responseData.lat,
        longitude: responseData.lng,
        latitudeDelta: 0.0232,
        longitudeDelta: 0.0131,
      };
    });
  };

  onRegionChange = (region) => {
    setRegionState(region);
  };
  return regionState ? (
    <MapView
      provider="google"
      style={styles.map}
      initialRegion={regionState}
      region={regionState}
    //onRegionChange={onRegionChange}
    >
      {markers.map((marker) => (
        <Marker
          key={`${marker.latitude}${marker.longitude}${marker.dateTime
            }${Math.random()}`}
          title={marker.gpSurgery.Name}
          description={marker.gpSurgery.Details.match(postCodeRegEx)[0]}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
            latitudeDelta: 0.0222,
            longitudeDelta: 0.0121,
          }}
          onPress={() => {
            if (!props.bookedGP)
              props.markerClick(marker)
          }}
        />
      ))}
    </MapView>
  ) : (
      <View style={styles.loadingSpinner}>
        <ActivityIndicator animating={true} size="large" color="#00ff00" />
      </View>
    );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 300,
    flex: 1,
  },
  loadingSpinner: {
    flex: 1,

    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default withReduxStore(LocationsMap);

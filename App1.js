import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

import icon from './icon.png'
import coordenadas from './coordenadas';


const GOOGLE_MAPS_APIKEY = 'AIzaSyBUyhfPfMCQaP0wI3WwxSuX4U-64_dLg_k';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      region: {
        latitude: -21.7631857,
        longitude: -43.3479309,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },

      coordinates: coordenadas.coordenadas,
      destino: null
    };
    this.mapView = null;
  }



  componentDidMount() {

    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      },
      (error) => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      }
    );
  }
  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  onMapPress = (e) => {
    console.log("clicou")
    // if (this.state.destino == e.nativeEvent.coordinate) {
    //   this.setState({ destino: false })
    // } else
    //   this.setState({ destino: parseInt(e.nativeEvent.coordinate) })
  }

  onMarkerPress = (e) => {
    console.log(e.nativeEvent.coordinate)
    const index = parseInt(e.nativeEvent.id, 10);
    if (isNan(index)) {
      return;
    }
  }

  show() {
    this.myLocation.showCallout();
  }

  hide() {
    this.myLocation.hideCallout();
  }

  render() {
    const { destino, region } = this.state;
    return (
      <View>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.container}
          //customMapStyle={RetroMapStyles}
          showsUserLocation={true}
          //onRegionChange={region => this.setState({ region })}
          //onRegionChangeComplete={region => this.setState({ region })}
          loadingEnabled
          initialRegion={this.state.region}
          ref={c => this.mapView = c}
        //onPress={this.onMapPress}
        >
          <MapView.Marker
            ref={ref => { this.myLocation = ref; }}
            key={'local'}
            coordinate={this.state.region}
            pinColor={'random'}
            title="Localização"
            description="Você está aqui!"
          />


          {/* this.state.coordinates.map((coordinate */}
          {coordenadas.coordenadas.map((coordenada, index) =>
            <MapView.Marker
              key={`coordinate_${index}`}
              identifier={index.toString()}
              coordinate={coordenada}
              image={icon}
              onPress={() => this.setState({ destino: coordenada })}

            />
          )}

          {
            destino
              ? <MapView.Marker
                key={destino}
                coordinate={destino}
                image={icon} />
              : console.log()
          }


          {(destino && region) && (
            <MapViewDirections
              origin={this.state.region}
              //waypoints={(this.state.coordinates.length > 2) ? this.state.coordinates.slice(1, -1) : null}
              destination={destino}
              apikey={"AIzaSyBUyhfPfMCQaP0wI3WwxSuX4U-64_dLg_k"}
              strokeWidth={2}
              strokeColor="blue"
              onStart={(params) => {
                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                this.setState({ loading: false })
              }}
              onReady={(result) => {
                this.mapView.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: (width / 20),
                    bottom: (height / 20),
                    left: (width / 20),
                    top: (height / 20),
                  }
                });
              }}
              onError={(errorMessage) => {
                console.log('GOT AN ERROR ' + errorMessage);
              }}
            />
          )
          }

        </MapView>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
});

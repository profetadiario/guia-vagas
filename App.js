import React, { Component } from 'react';
import { AppRegistry, StyleSheet, View, Dimensions, TouchableOpacity, Text, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { OpenMapDirections } from 'react-native-navigation-directions';

//import RetroMapStyles from './RetroMapStyles.json';
import icon from './icon.png'
import coordenadas from './coordenadas';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDiUC1URnFzpMmb_YE58WWHG7HVzzb3C0U';
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      local: {
        latitude: -21.7631857,
        longitude: -43.3479309,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },

      coordinates: coordenadas.coordenadas,
      destino: null,
      region: null,
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

  _callShowDirections = (coordenada) => {
    const startPoint = {
      longitude: this.state.region.longitude,
      latitude: this.state.region.latitude
    }

    const endPoint = {
      longitude: this.state.destino.longitude,
      latitude: this.state.destino.latitude
    }

    const transportPlan = 'd';

    OpenMapDirections(startPoint, endPoint, transportPlan).then(res => {
      console.log(res)
    });
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
          loadingEnabled={true}
          initialRegion={this.state.local}
          ref={c => this.mapView = c}
        //onPress={this.onMapPress}
        >
          {
            this.state.region != null
              ?
              <MapView.Marker
                ref={ref => { this.myLocation = ref; }}
                key={'local'}
                coordinate={this.state.region}
                //pinColor={'green'}
                title="Localização"
                description="Você está aqui!"
              />
              : null
          }
          {coordenadas.coordenadas.map((coordenada, index) =>
            <MapView.Marker
              key={`coordinate_${index}`}
              identifier={index.toString()}
              coordinate={coordenada}
              image={icon}
              onPress={() => {
                this.setState({ destino: coordenada }),
                  Alert.alert('Navegação', "Deseja ativar a rota até a vaga?",
                    [{ text: 'Ir para Vaga', onPress: () => this._callShowDirections(coordenada) },
                    { text: 'Cancelar', onPress: () => false }, { cancelable: true }]);
              }}
              title="Vaga"
            //description="!"
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

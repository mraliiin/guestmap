import React, { Component } from 'react';

import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.css'
import './App.css'

import MessageCard from './components/MessageCard';

// hack
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api/v1/messages' : '/production';
const GEO_API_URL = 'https://ipapi.co/json';

const DEFAULT_ZOOM_LEVEL = 6;
const DEFAULT_LOCATION = { lat: 37.505, long: -90.09 };

class App extends Component {
    state = {
        location: DEFAULT_LOCATION,
        zoom: DEFAULT_ZOOM_LEVEL / 2,
        messages: [],
    }

    getAllMessages = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(messages => {
                this.setState({ 
                    messages,
                });
            })
    }

    getUserGeoLocation() {
        navigator.geolocation.getCurrentPosition((p) => {
            if (p) {
                this.setState({
                    location: {
                        lat: p.coords.latitude,
                        long: p.coords.longitude,
                    },
                    zoom: DEFAULT_ZOOM_LEVEL,
                });
            }
        }, () => {
            console.debug('no location permissions');

            fetch(GEO_API_URL)
                .then(res => res.json())
                .then(location => {
                    this.setState({
                        location: {
                            lat: location.latitude,
                            long: location.longitude,
                        },
                        zoom: DEFAULT_ZOOM_LEVEL,
                    })
                })
        });
    }

    componentDidMount() {
        this.getAllMessages();
        this.getUserGeoLocation();
    }

    render() {
        const position = [ this.state.location.lat, this.state.location.long]

        return (
            <div className="main-container">
                <Map className="map" center={position} zoom={this.state.zoom}>
                    <TileLayer attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    { 
                        this.state.haveUserLocation ? <Marker position={position}></Marker> : ''
                    }
                    { 
                        this.state.messages.map(m => (
                            <Marker key={m._id} position={[m.latitude, m.longitude]}>
                                <Popup>
                                    <strong>{m.name}:</strong> {m.message}
                                </Popup>
                            </Marker> 
                        ))
                    }
                </Map> 

                <MessageCard location={this.state.location}></MessageCard>
            </div>
        );
    }
}

export default App;

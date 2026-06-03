import React from "react";
import scooter from "../assets/scooter.png";
import home from "../assets/home.png";
import L, { icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer,Marker,Polyline,Popup,TileLayer } from "react-leaflet";

const deliveryBoyIcon = new L.Icon({
  iconUrl: scooter,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const customerIcon = new L.Icon({
  iconUrl: home,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});
const DelBoyTracking = ({ data }) => {
  const deliveryBoyLat = data?.delBoyLocation?.lat;
  const deliveryBoyLong = data?.delBoyLocation?.long;
  const customerLat = data?.customerLocation?.lat;
  const customerLong = data?.customerLocation?.long;
  const path = [
    [deliveryBoyLat, deliveryBoyLong],
    [customerLat, customerLong],
  ];
  const center = [deliveryBoyLat, deliveryBoyLong];
  return (
    <div className="w-full h-100 mt-3 rounded-xl overflow-hidden shadow-md ">
      <MapContainer
        className="h-full w-full"
        center={center}
        zoom={16}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
       <Marker position={[deliveryBoyLat,deliveryBoyLong]} icon={deliveryBoyIcon}>
        <Popup>Delivery Boy</Popup>
       </Marker>
        <Marker position={[customerLat,customerLong]} icon={customerIcon}></Marker>
        <Polyline positions={path} color="blue" weight={4} />

      </MapContainer>
    </div>
  );
};

export default DelBoyTracking;

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Property } from '../../types';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Custom marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LeafletMapViewProps {
  properties: Property[];
  height?: string;
}

export const LeafletMapView: React.FC<LeafletMapViewProps> = ({
  properties,
  height = '500px'
}) => {
  // Center map on Accra (default) or first property
  const centerLat = properties.length > 0 ? properties[0].location.lat : 5.6037;
  const centerLng = properties.length > 0 ? properties[0].location.lng : -0.1870;

  return (
    <div style={{ height }} className="w-full rounded-3xl overflow-hidden shadow-lg border border-gray-200 relative">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={12}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.location.lat, property.location.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="w-52 space-y-2 p-1">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-28 object-cover rounded-lg"
                />
                <div className="text-xs font-bold text-navy-950 truncate">
                  {property.title}
                </div>
                <div className="text-xs text-gray-500 font-semibold">
                  {property.location.area}
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <span className="text-sm font-black text-navy-950">
                    {property.currency}{property.price_per_night}/night
                  </span>
                  <Link
                    to={`/stays/${property.id}`}
                    className="text-xs font-extrabold text-gold-600 hover:underline"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

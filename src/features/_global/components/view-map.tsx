import { LatLngLiteral } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export interface ViewMapProps {
  position?: LatLngLiteral;
  label?: React.ReactNode;
  zoom?: number;
  markerContent?: React.ReactNode;
}

export const ViewMap = ({ zoom = 13, ...props }: ViewMapProps) => {
  return (
    <div className="z-[11] w-full aspect-video relative mb-2">
      <MapContainer
        center={props.position}
        zoom={zoom}
        scrollWheelZoom={false}
        className="aspect-video w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.position && (
          <Marker position={props.position}>
            <Popup>{props.markerContent || "-"}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

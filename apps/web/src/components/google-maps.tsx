/*
"use client";

import { useEffect, useRef } from "react";

interface GoogleMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

export default function GoogleMap({ 
  address = "Merianweg 3, 93051 Regensburg",
  lat = 49.0134,
  lng = 12.0962,
  zoom = 15 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "off" }],
        },
      ],
    });

    new google.maps.Marker({
      position: { lat, lng },
      map,
      title: address,
    });
  }, [lat, lng, zoom, address]);

  return <div ref={mapRef} className="w-full h-[400px]" />;
}
*/
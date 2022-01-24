import React, { useState, useEffect } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import api from "../utils/api.json";
import { getOptions } from "../utils/utils";

const projection = geoEqualEarth()
  .scale(160)
  .translate([800 / 2, 450 / 2]);

const WorldMap = ({ places }) => {
  const [geographies, setGeographies] = useState([]);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const data = {
      locations: places.map((place) => ({
        street: place.find((v) => v.type === "street").label,
        postalCode: place.find((v) => v.type === "postalCode").label,
        city: place.find((v) => v.type === "city").label,
      })),
      options: {
        thumbMaps: false,
      },
    };

    fetch(api.geo, getOptions(data))
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((responseJson) => {
        const coordinates = responseJson.results[0].locations[0].latLng;

        setMarker([coordinates.lng, coordinates.lat]);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/world-110m.json")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((responseJson) => {
        setGeographies(
          feature(responseJson, responseJson.objects.countries).features
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCountryClick = (countryIndex) => {
    console.log("Clicked on country: ", geographies[countryIndex]);
  };

  const handleMarkerClick = (i) => {
    // console.log("Marker: ", cities[i]);
  };

  return (
    <svg width={800} height={450} viewBox="0 0 800 450">
      <g className="countries">
        {geographies.map((d, i) => (
          <path
            key={`path-${i}`}
            d={geoPath().projection(projection)(d)}
            className="country"
            // fill={`rgba(38,50,56,${(1 / geographies.length) * i})`}
            stroke="#FFFFFF"
            strokeWidth={0.5}
            onClick={() => handleCountryClick(i)}
          />
        ))}
      </g>
      <g className="markers">
        {marker && (
          <circle
            cx={projection(marker)[0]}
            cy={projection(marker)[1]}
            r={5}
            fill="#E91E63"
            stroke="#FFFFFF"
            className="marker"
            onClick={() => handleMarkerClick()}
          />
        )}
      </g>
    </svg>
  );
};

export default WorldMap;

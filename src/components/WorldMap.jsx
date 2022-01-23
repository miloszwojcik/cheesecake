import React, { useState, useEffect } from "react";
import { geoEqualEarth, geoPath } from "d3-geo";
import { feature } from "topojson-client";

const projection = geoEqualEarth()
  .scale(160)
  .translate([800 / 2, 450 / 2]);

const WorldMap = ({ places }) => {
  const [geographies, setGeographies] = useState([]);
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    const data = {
      locations: places.map((place) => ({
        street: place.find((v) => v.type === "address").label,
        postalCode: place.find((v) => v.type === "zip").label,
        city: place.find((v) => v.type === "city").label,
      })),
      options: {
        thumbMaps: false,
      },
    };

    console.log("data", data);

    const options = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    };

    fetch(
      "http://www.mapquestapi.com/geocoding/v1/batch?key=FHZdqT8GWrAggBJLnSnDzjqFA9hbsMdc",
      options
    )
      .then((response) => {
        console.log("response", response);

        return response.json();
      })
      .then((res) => {
        console.log("res", res);

        const coordinates = res.results[0].locations[0].latLng;

        setMarker([coordinates.lng, coordinates.lat]);
      });

    fetch("/world-110m.json").then((response) => {
      if (response.status !== 200) {
        console.log(`There was a problem: ${response.status}`);
        return;
      }
      response.json().then((worlddata) => {
        setGeographies(
          feature(worlddata, worlddata.objects.countries).features
        );
      });
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
            fill={`rgba(38,50,56,${(1 / geographies.length) * i})`}
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

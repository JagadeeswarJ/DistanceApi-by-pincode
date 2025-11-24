require("dotenv").config();
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

/**
 * Get distance between two PIN codes using Google Distance Matrix API.
 */
async function getDistance(originPin, destinationPin) {
  if (!originPin || !destinationPin)
    throw new Error("Both PIN codes are required.");

  const origin = `India ${originPin}`;
  const destination = `India ${destinationPin}`;

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (
      !data.rows ||
      !data.rows[0] ||
      !data.rows[0].elements ||
      !data.rows[0].elements[0]
    ) {
      throw new Error(
        `Invalid API response structure: ${JSON.stringify(data)}`
      );
    }

    const element = data.rows[0].elements[0];
    
    if (element.status !== "OK") {
      throw new Error(`Distance API Error: ${element.status}`);
    }

    const distanceText = element.distance.text;
    const distanceKm = parseFloat(distanceText.replace(" km", ""));

    return distanceKm;
  } catch (error) {
    throw new Error(`Failed to fetch distance: ${error.message}`);
  }
}

getDistance("500090", "500067")
  .then((distance) => {
    console.log("Distance:", distance, "km");
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

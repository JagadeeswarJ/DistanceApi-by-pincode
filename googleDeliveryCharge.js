require("dotenv").config();
const fetch = require("node-fetch");
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

console.log(GOOGLE_API_KEY);

// Generate full Hyderabad PIN code set (500001–500104)
const hyderabadPincodes = new Set(
  Array.from({ length: 104 }, (_, i) => String(500001 + i).padStart(6, "0"))
);

/**
 * Check if both origin and destination PIN codes are in Hyderabad.
 */
function isInHyderabad(originPin, destinationPin) {
  return (
    hyderabadPincodes.has(originPin) && hyderabadPincodes.has(destinationPin)
  );
}

/**
 * Calculate delivery fee based on distance and location rule.
 */
function calculateDeliveryFee(distanceKm, isLocal) {
  if (isLocal) return 40;
  if (distanceKm <= 5) return 35;
  if (distanceKm <= 15) return 55;
  return Math.ceil(distanceKm) * 7;
}

/**
 * Get Google Distance Matrix distance between two PIN codes and compute delivery charge.
 */
async function getDeliveryCharge(originPin, destinationPin) {
  if (!originPin || !destinationPin)
    throw new Error("Both PIN codes are required.");

  const origin = `India ${originPin}`;
  const destination = `India ${destinationPin}`;
  const isLocal = isInHyderabad(originPin, destinationPin);

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // console.log("API Response:", JSON.stringify(data, null, 2));

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
    const deliveryFee = calculateDeliveryFee(distanceKm, isLocal);

    return {
      originPin,
      destinationPin,
      distanceKm,
      isLocalHyderabad: isLocal,
      deliveryFee,
    };
  } catch (error) {
    throw new Error(`Failed to fetch distance: ${error.message}`);
  }
}

getDeliveryCharge("500020", "500090")
  .then((result) => {
    console.log("Result:", result);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  });

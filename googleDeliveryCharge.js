// distanceMatrix.js
const fetch = require("node-fetch");

// === CONFIG ===
const GOOGLE_API_KEY = "YOUR_API_KEY_HERE"; // Replace with your actual key

// === DELIVERY CHARGE LOGIC ===
function calculateDeliveryFee(distanceKm) {
  const baseDistance = 5; // Free up to 5 km
  const baseCharge = 40; // ₹40 base charge
  const extraPerKm = 10; // ₹10 per km beyond base

  if (distanceKm <= baseDistance) {
    return baseCharge;
  } else {
    return baseCharge + Math.ceil(distanceKm - baseDistance) * extraPerKm;
  }
}

// === MAIN FUNCTION ===
async function getDistanceAndDeliveryCharge(originPincode, destinationPincode) {
  const origin = `India ${originPincode}`;
  const destination = `India ${destinationPincode}`;
    const api_key = "AIzaSyB-AwKnePUFEX1bsHGnxsk6bEArkjWJDuI";
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${api_key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.rows[0].elements)
    const element = data.rows[0].elements[0];

    if (element.status !== "OK") {
      console.error("Error getting distance:", element.status);
      return;
    }

    const distanceText = element.distance.text; // e.g. "2150 km"
    const distanceKm = parseFloat(distanceText.replace(" km", ""));
    const deliveryCharge = calculateDeliveryFee(distanceKm);

    console.log(`📦 From ${originPincode} to ${destinationPincode}`);
    console.log(`📏 Distance: ${distanceKm} km`);
    console.log(`💰 Delivery Fee: ₹${deliveryCharge}`);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

// === SIMULATE ===
getDistanceAndDeliveryCharge("110001", "560001"); // Delhi → Bangalore


require("dotenv").config();

// API Key from environment variable
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error("Error: GOOGLE_API_KEY not found in .env file");
  process.exit(1);
}

console.log("=".repeat(60));
console.log("Google Maps API Testing Suite");
console.log("=".repeat(60));

/**
 * Test 1: Geocoding API
 * Converts an address to latitude/longitude coordinates
 */
async function testGeocodingAPI() {
  console.log("\n[TEST 1] Testing Geocoding API...");

  const address = "New York";
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      console.log(" Geocoding API: SUCCESS");
      console.log(`  Address: ${data.results[0].formatted_address}`);
      console.log(`  Coordinates: ${location.lat}, ${location.lng}`);
      return true;
    } else {
      console.log(` Geocoding API: FAILED - ${data.status}`);
      console.log(`  Error: ${data.error_message || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.log(` Geocoding API: ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Test 2: Reverse Geocoding API
 * Converts coordinates to an address
 */
async function testReverseGeocodingAPI() {
  console.log("\n[TEST 2] Testing Reverse Geocoding API...");

  const lat = 40.7128;
  const lng = -74.0060;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      console.log(" Reverse Geocoding API: SUCCESS");
      console.log(`  Coordinates: ${lat}, ${lng}`);
      console.log(`  Address: ${data.results[0].formatted_address}`);
      return true;
    } else {
      console.log(` Reverse Geocoding API: FAILED - ${data.status}`);
      console.log(`  Error: ${data.error_message || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.log(` Reverse Geocoding API: ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Test 3: Places API - Autocomplete
 * Get place predictions for a search query
 */
async function testPlacesAutocompleteAPI() {
  console.log("\n[TEST 3] Testing Places API - Autocomplete...");

  const input = "pizza";
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      console.log(" Places API (Autocomplete): SUCCESS");
      console.log(`  Query: "${input}"`);
      console.log(`  Found ${data.predictions.length} predictions:`);
      data.predictions.slice(0, 3).forEach((pred, idx) => {
        console.log(`  ${idx + 1}. ${pred.description}`);
      });
      return true;
    } else {
      console.log(` Places API (Autocomplete): FAILED - ${data.status}`);
      console.log(`  Error: ${data.error_message || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.log(` Places API (Autocomplete): ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Test 4: Places API - Nearby Search
 * Find places near a location
 */
async function testPlacesNearbySearchAPI() {
  console.log("\n[TEST 4] Testing Places API - Nearby Search...");

  const location = "12.9716,77.5946"; // Bangalore
  const radius = 5000;
  const type = "restaurant";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" || data.status === "ZERO_RESULTS") {
      console.log(" Places API (Nearby Search): SUCCESS");
      console.log(`  Location: Bangalore (12.9716, 77.5946)`);
      console.log(`  Type: ${type}, Radius: ${radius}m`);
      console.log(`  Found ${data.results.length} places`);
      if (data.results.length > 0) {
        data.results.slice(0, 3).forEach((place, idx) => {
          console.log(`  ${idx + 1}. ${place.name} - ${place.vicinity}`);
        });
      }
      return true;
    } else {
      console.log(` Places API (Nearby Search): FAILED - ${data.status}`);
      console.log(`  Error: ${data.error_message || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.log(` Places API (Nearby Search): ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Test 5: Distance Matrix API
 * Calculate distance and duration between two locations
 */
async function testDistanceMatrixAPI() {
  console.log("\n[TEST 5] Testing Distance Matrix API...");

  const origins = "India 500090"; // Hyderabad pin code
  const destinations = "India 500067"; // Another Hyderabad pin code
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.rows[0]?.elements[0]?.status === "OK") {
      const element = data.rows[0].elements[0];
      console.log(" Distance Matrix API: SUCCESS");
      console.log(`  Origin: ${data.origin_addresses[0]}`);
      console.log(`  Destination: ${data.destination_addresses[0]}`);
      console.log(`  Distance: ${element.distance.text}`);
      console.log(`  Duration: ${element.duration.text}`);
      return true;
    } else {
      console.log(` Distance Matrix API: FAILED - ${data.status}`);
      if (data.error_message) {
        console.log(`  Error: ${data.error_message}`);
      }
      if (data.rows[0]?.elements[0]?.status) {
        console.log(`  Element Status: ${data.rows[0].elements[0].status}`);
      }
      return false;
    }
  } catch (error) {
    console.log(` Distance Matrix API: ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Test 6: Directions API
 * Get directions between two locations
 */
async function testDirectionsAPI() {
  console.log("\n[TEST 6] Testing Directions API...");

  const origin = "12.9716,77.5946"; // Bangalore
  const destination = "13.0827,80.2707"; // Chennai
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      const route = data.routes[0];
      const leg = route.legs[0];
      console.log(" Directions API: SUCCESS");
      console.log(`  From: ${leg.start_address}`);
      console.log(`  To: ${leg.end_address}`);
      console.log(`  Distance: ${leg.distance.text}`);
      console.log(`  Duration: ${leg.duration.text}`);
      console.log(`  Steps: ${leg.steps.length}`);
      return true;
    } else {
      console.log(` Directions API: FAILED - ${data.status}`);
      console.log(`  Error: ${data.error_message || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.log(` Directions API: ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Test 7: Time Zone API
 * Get timezone for a location
 */
async function testTimeZoneAPI() {
  console.log("\n[TEST 7] Testing Time Zone API...");

  const location = "39.6034810,-119.6822510"; // Reno, Nevada
  const timestamp = Math.floor(Date.now() / 1000);
  const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${location}&timestamp=${timestamp}&key=${GOOGLE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK") {
      console.log(" Time Zone API: SUCCESS");
      console.log(`  Location: ${location}`);
      console.log(`  Time Zone ID: ${data.timeZoneId}`);
      console.log(`  Time Zone Name: ${data.timeZoneName}`);
      return true;
    } else {
      console.log(` Time Zone API: FAILED - ${data.status}`);
      console.log(`  Error: ${data.error_message || "Unknown error"}`);
      return false;
    }
  } catch (error) {
    console.log(` Time Zone API: ERROR - ${error.message}`);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  const startTime = Date.now();

  const results = {
    geocoding: await testGeocodingAPI(),
    reverseGeocoding: await testReverseGeocodingAPI(),
    placesAutocomplete: await testPlacesAutocompleteAPI(),
    placesNearby: await testPlacesNearbySearchAPI(),
    distanceMatrix: await testDistanceMatrixAPI(),
    directions: await testDirectionsAPI(),
    timeZone: await testTimeZoneAPI()
  };

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("TEST SUMMARY");
  console.log("=".repeat(60));

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${total - passed}`);
  console.log(`Duration: ${duration}s`);
  console.log("\nDetailed Results:");

  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? "" : "";
    const status = passed ? "PASS" : "FAIL";
    console.log(`  ${icon} ${test}: ${status}`);
  });

  console.log("=".repeat(60));

  // Exit with appropriate code
  process.exit(passed === total ? 0 : 1);
}

// Run the tests
runAllTests().catch(error => {
  console.error("\nFatal error running tests:", error);
  process.exit(1);
});

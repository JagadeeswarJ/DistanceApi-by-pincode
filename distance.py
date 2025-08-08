import math
import pandas as pd

# STEP 1: Load pincode-lat-lon data (assuming CSV)
df = pd.read_csv("pincode_latlong.csv")  # Must include 'pincode', 'latitude', 'longitude' columns
pincode_dict = {
    str(row["pincode"]): (row["latitude"], row["longitude"])
    for _, row in df.iterrows()
}

# STEP 2: Haversine formula to compute distance (in km)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    lat1, lon1, lat2, lon2 = float(lat1), float(lon1), float(lat2), float(lon2)
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2) ** 2 +
         math.cos(phi1) * math.cos(phi2) *
         math.sin(delta_lambda / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c

# STEP 3: Function to find closest pincode when exact match not found
def find_closest_pincode(target_pin):
    target_pin = str(target_pin)
    available_pins = list(pincode_dict.keys())
    
    # Try exact match first
    if target_pin in pincode_dict:
        return target_pin
    
    # Find closest by string similarity (numeric proximity)
    try:
        target_num = int(target_pin)
        closest_pin = min(available_pins, key=lambda x: abs(int(x) - target_num))
        return closest_pin
    except ValueError:
        # If not numeric, return first available pincode
        return available_pins[0] if available_pins else None

# STEP 4: Function to calculate distance from new PIN
def distance_from_pincode(input_pin, reference_pin):
    input_pin = str(input_pin)
    reference_pin = str(reference_pin)
    
    # Find closest available pincodes if exact matches don't exist
    actual_input_pin = find_closest_pincode(input_pin)
    actual_reference_pin = find_closest_pincode(reference_pin)
    
    if actual_input_pin is None or actual_reference_pin is None:
        return None
    
    lat1, lon1 = pincode_dict[actual_input_pin]
    lat2, lon2 = pincode_dict[actual_reference_pin]
    
    distance = haversine(lat1, lon1, lat2, lon2)
    
    # Print which pincodes were actually used if different from input
    if actual_input_pin != input_pin or actual_reference_pin != reference_pin:
        print(f"Using closest available: {input_pin} -> {actual_input_pin}, {reference_pin} -> {actual_reference_pin}")
    
    return distance

# Example usage:
input_pin = "500067"
reference_pin = "500020"
distance_km = distance_from_pincode(input_pin, reference_pin)
print(f"Distance between {input_pin} and {reference_pin}: {distance_km:.2f} km")

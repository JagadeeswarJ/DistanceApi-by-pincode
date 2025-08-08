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

# STEP 3: Function to calculate distance from new PIN
def distance_from_pincode(input_pin, reference_pin):
    if input_pin not in pincode_dict or reference_pin not in pincode_dict:
        return None
    lat1, lon1 = pincode_dict[input_pin]
    lat2, lon2 = pincode_dict[reference_pin]
    return haversine(lat1, lon1, lat2, lon2)

# Example usage:
input_pin = "500067"
reference_pin = "500020"
distance_km = distance_from_pincode(input_pin, reference_pin)
print(f"Distance between {input_pin} and {reference_pin}: {distance_km:.2f} km")

export const TRAVEL_FEE_BASES = [
  {
    id: "newburgh",
    label: "Newburgh Base",
    address: "5177 Route 9W, Suite 2, Newburgh, NY 12550",
    coordinates: { lat: 41.5749, lng: -73.9899 },
  },
  {
    id: "water-street",
    label: "Water Street Base",
    address: "180 Water Street, New York, NY 10038",
    coordinates: { lat: 40.7069, lng: -74.0042 },
  },
];

export const TRAVEL_FEE_RULES = {
  minimumFee: 50,
  manhattanFlatFee: 150,
  roundTripRatePerMile: 6,
};

export const TRAVEL_FEE_MESSAGES = {
  missingConfig: "Travel fee unavailable until maps API is configured.",
  invalidAddress: "Enter a full address so we can calculate your travel fee.",
  providerError: "Travel fee is unavailable for this address. Please try again.",
};

const GOOGLE_DISTANCE_MATRIX_ENDPOINT =
  "https://maps.googleapis.com/maps/api/distancematrix/json";
const GOOGLE_GEOCODING_ENDPOINT = "https://maps.googleapis.com/maps/api/geocode/json";

export function isLikelyManhattanAddress(address = "") {
  const normalized = address.toLowerCase();

  return (
    normalized.includes("manhattan") ||
    normalized.includes("new york, ny 100") ||
    normalized.includes("new york ny 100")
  );
}

export function calculateDistanceTravelFee(miles) {
  return Math.max(
    TRAVEL_FEE_RULES.minimumFee,
    Math.ceil(Number(miles || 0) * TRAVEL_FEE_RULES.roundTripRatePerMile),
  );
}

export function getManhattanTravelFeeResult(address) {
  return {
    ok: true,
    fee: TRAVEL_FEE_RULES.manhattanFlatFee,
    miles: null,
    base: "manhattan",
    source: "manhattan-flat-rate",
    address,
    message: "",
  };
}

export function getMissingConfigTravelFeeResult() {
  return {
    ok: false,
    fee: 0,
    miles: null,
    base: null,
    source: "missing-config",
    message: TRAVEL_FEE_MESSAGES.missingConfig,
  };
}

export function getInvalidAddressTravelFeeResult() {
  return {
    ok: false,
    fee: 0,
    miles: null,
    base: null,
    source: "invalid-address",
    message: TRAVEL_FEE_MESSAGES.invalidAddress,
  };
}

export function getProviderErrorTravelFeeResult(message = TRAVEL_FEE_MESSAGES.providerError) {
  return {
    ok: false,
    fee: 0,
    miles: null,
    base: null,
    source: "provider-error",
    message,
  };
}

export function getBestTravelFeeResult({ address, distances }) {
  const bestDistance = distances
    .filter((distance) => Number.isFinite(distance.miles))
    .sort((a, b) => a.miles - b.miles)[0];

  if (!bestDistance) {
    return getProviderErrorTravelFeeResult();
  }

  return {
    ok: true,
    fee: calculateDistanceTravelFee(bestDistance.miles),
    miles: bestDistance.miles,
    base: bestDistance.base.id,
    source: "maps-api",
    address,
    message: "",
  };
}

async function getGoogleDistanceMiles(origin, destination, apiKey) {
  const url = new URL(GOOGLE_DISTANCE_MATRIX_ENDPOINT);
  url.searchParams.set("origins", origin);
  url.searchParams.set("destinations", destination);
  url.searchParams.set("units", "imperial");
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Maps API request failed.");
  }

  const data = await response.json();
  const element = data.rows?.[0]?.elements?.[0];

  if (data.status !== "OK") {
    throw new Error(data.error_message || `Maps API returned ${data.status}.`);
  }

  if (element?.status !== "OK" || !element.distance?.value) {
    throw new Error(`Maps API route status: ${element?.status || "UNKNOWN"}.`);
  }

  return element.distance.value / 1609.344;
}

async function getGoogleCoordinates(address, apiKey) {
  const url = new URL(GOOGLE_GEOCODING_ENDPOINT);
  url.searchParams.set("address", address);
  url.searchParams.set("key", apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Google geocoding request failed.");
  }

  const data = await response.json();
  const location = data.results?.[0]?.geometry?.location;

  if (data.status !== "OK" || !location) {
    throw new Error(data.error_message || `Google geocoding returned ${data.status}.`);
  }

  return location;
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function calculateHaversineMiles(origin, destination) {
  const earthRadiusMiles = 3958.8;
  const latDistance = toRadians(destination.lat - origin.lat);
  const lngDistance = toRadians(destination.lng - origin.lng);
  const startLat = toRadians(origin.lat);
  const endLat = toRadians(destination.lat);
  const haversine =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDistance / 2) ** 2;

  return 2 * earthRadiusMiles * Math.asin(Math.sqrt(haversine));
}

export async function getTravelFeeForAddress(address) {
  const destinationAddress = String(address || "").trim();

  if (!destinationAddress) {
    return getInvalidAddressTravelFeeResult();
  }

  if (isLikelyManhattanAddress(destinationAddress)) {
    return getManhattanTravelFeeResult(destinationAddress);
  }

  const provider =
    process.env.MAPS_PROVIDER || process.env.NEXT_PUBLIC_MAPS_PROVIDER || "google";
  const googleApiKey =
    process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!["google", "maps-api"].includes(provider) || !googleApiKey) {
    return getMissingConfigTravelFeeResult();
  }

  try {
    const distanceResults = await Promise.allSettled(
      TRAVEL_FEE_BASES.map(async (base) => ({
        base,
        miles: await getGoogleDistanceMiles(base.address, destinationAddress, googleApiKey),
      })),
    );
    const distances = distanceResults
      .filter((result) => result.status === "fulfilled")
      .map((result) => result.value);

    if (!distances.length) {
      const destinationCoordinates = await getGoogleCoordinates(
        destinationAddress,
        googleApiKey,
      );

      distances.push(
        ...TRAVEL_FEE_BASES.map((base) => ({
          base,
          miles: calculateHaversineMiles(base.coordinates, destinationCoordinates),
        })),
      );
    }

    return getBestTravelFeeResult({ address: destinationAddress, distances });
  } catch (error) {
    return getProviderErrorTravelFeeResult(error.message);
  }
}

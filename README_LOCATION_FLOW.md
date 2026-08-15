# Location & Address Flow Documentation

This document explains the flow and logic behind the location detection, map picking, and reverse geocoding features in the Team Naturals frontend application.

## Overview

The application provides two main ways for a user to specify their delivery address:
1. **Automatic Detection:** Using the `UseCurrentLocationButton`.
2. **Visual Map Picker:** Using the `LocationPickerModal`.

Both of these methods ultimately rely on custom Next.js API routes (`/api/location/reverse` and `/api/location/search`) that securely communicate with the **Geoapify** API to convert GPS coordinates into human-readable address fields, or text into location coordinates.

---

## 1. The Next.js API Route (`app/api/location/reverse/route.ts`)

This server-side route acts as a secure proxy between the frontend components and the external Geoapify service.

**Flow:**
- Accepts `GET` requests with `lat` (latitude) and `lon` (longitude) query parameters.
- Validates the presence of these coordinates.
- Retrieves the `GEOAPIFY_API_KEY` from the server's environment variables. This ensures the API key is never exposed to the client-side browser.
- Makes a request to `https://api.geoapify.com/v1/geocode/reverse` with the coordinates and the API key.
- A centralized server-side parser (`parseGeoapifyAddress`) cleans up the Geoapify response and converts it into a standard `LocationData` object.
- Returns the cleaned `LocationData` back to the frontend. Raw Geoapify data never hits the browser.

---

## 2. Automatic Detection (`UseCurrentLocationButton.tsx`)

This component provides a simple "Use Current Location" button for quick address entry.

**Flow & Logic:**
1. **Support Check:** On mount, it checks if `navigator.geolocation` is supported by the browser. If not, the component hides itself.
2. **Trigger:** When the user clicks the button, it triggers the browser's native GPS prompt (`navigator.geolocation.getCurrentPosition`).
3. **API Call:** Once coordinates are retrieved, it sends them to our `/api/location/reverse` endpoint.
   - The API route returns a fully parsed `LocationData` object, so no complex parsing is needed in the component itself.
   - The server handles the logic of finding the best named place, street, and locality, and cleanly separates Indian address concepts (e.g. 6-digit PIN).
5. **State Management:** It handles `idle`, `loading`, `success`, and `error` states, showing a success message for a few seconds before reverting, or an error message if location access is denied or the API fails.
6. **Callback:** It passes the formatted `LocationData` back to the parent component via the `onLocationFound` prop.

---

## 3. Visual Map Picker (`LocationPickerModal.tsx`)

This component provides an interactive map interface using `maplibre-gl` for users to drop a pin on their exact location.

**Flow & Logic:**
1. **Map Initialization:** It initializes a MapLibre map centered on a default location (central India) or the user's location if the GPS button is clicked. It uses a reliable OpenStreetMap raster base layer.
2. **Map Movement & Debouncing:** 
   - A static pin overlay sits in the exact center of the map view.
   - When the user drags the map, the component listens for the `moveend` event.
   - To prevent spamming the geocoding API while the user is actively dragging the map, it uses a **500ms debounce timer**. It only fires the reverse geocoding API call once the map has stopped moving for half a second.
3. **API Call:** It calls the same `/api/location/reverse` endpoint with the coordinates of the map's center.
4. **Data Parsing:** The backend API automatically parses the Geoapify response and sends back a normalized `LocationData` object, keeping the component purely focused on UI.
5. **GPS Fallback:** It also includes a "Use my current location" button on the map itself. Clicking this uses the browser's GPS to instantly fly the map to the user's physical coordinates.
6. **Confirmation:** Once an address is successfully fetched for the current pin location, the user can click "Confirm location", which triggers the `onConfirm` prop with the parsed `LocationData`.

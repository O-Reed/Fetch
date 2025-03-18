import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { locationApi } from '@/services/api';
import { Location, LocationSearchParams } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, MapPin } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  useJsApiLoader,
  Rectangle
} from '@react-google-maps/api';

// US States for dropdown
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
  'DC', 'PR', 'VI', 'GU', 'AS', 'MP'
];

// Define map container style
const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.375rem'
};

// Center of US as default
const defaultCenter = {
  lat: 39.8283,
  lng: -98.5795
};

// Google Maps API key
// In production, use environment variables
const GOOGLE_MAPS_API_KEY = 'AIzaSyBNLrJhOMz6idD05pzfn5lhA-TAw-mAZCU';

// Custom map styles for a more appealing visualization
const mapStyles = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      { color: '#e9e9e9' },
      { lightness: 17 }
    ]
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [
      { color: '#f5f5f5' },
      { lightness: 20 }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      { color: '#ffffff' },
      { lightness: 17 }
    ]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      { color: '#ffffff' },
      { lightness: 29 },
      { weight: 0.2 }
    ]
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      { color: '#ffffff' },
      { lightness: 18 }
    ]
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      { color: '#ffffff' },
      { lightness: 16 }
    ]
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      { color: '#f5f5f5' },
      { lightness: 21 }
    ]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      { color: '#dedede' },
      { lightness: 21 }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [
      { color: '#ffffff' },
      { lightness: 16 }
    ]
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      { color: '#444444' }
    ]
  }
];

const LocationSearchPage = () => {
  // Load Google Maps API using the hook from @react-google-maps/api
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: ['places']
  });

  const [searchParams, setSearchParams] = useState<LocationSearchParams>({
    size: 25
  });
  const [city, setCity] = useState<string>('');
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const [useMapBounds, setUseMapBounds] = useState<boolean>(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Search locations query
  const { data: locationData, isLoading, refetch } = useQuery({
    queryKey: ['locations', searchParams],
    queryFn: () => locationApi.searchLocations(searchParams),
    enabled: false, // Don't run automatically
  });

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Handle bounds change
  const onBoundsChanged = useCallback(() => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        setMapBounds({
          north: ne.lat(),
          south: sw.lat(),
          east: ne.lng(),
          west: sw.lng()
        });
      }
    }
  }, [map]);

  // Handle marker click
  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
  };

  // Apply search filters
  const applyFilters = () => {
    setIsSearching(true);

    const params: LocationSearchParams = {
      size: 25,
      from: (currentPage - 1) * 25
    };

    if (city.trim()) {
      params.city = city.trim();
    }

    if (selectedStates.length > 0) {
      params.states = selectedStates;
    }

    // Add bounding box if enabled
    if (useMapBounds && mapBounds) {
      params.geoBoundingBox = {
        top: { lat: mapBounds.north, lon: mapBounds.east },
        bottom: { lat: mapBounds.south, lon: mapBounds.west },
        left: { lat: mapBounds.north, lon: mapBounds.west },
        right: { lat: mapBounds.south, lon: mapBounds.east }
      };
    }

    setSearchParams(params);
    refetch().finally(() => setIsSearching(false));
  };

  // Reset all filters
  const resetFilters = () => {
    setCity('');
    setSelectedStates([]);
    setUseMapBounds(false);
    setCurrentPage(1);

    setSearchParams({
      size: 25
    });

    // Reset map to default view
    if (map) {
      map.setCenter(defaultCenter);
      map.setZoom(4);
    }

    setSelectedLocation(null);
  };

  // Handle state selection
  const toggleState = (state: string) => {
    if (selectedStates.includes(state)) {
      setSelectedStates(selectedStates.filter(s => s !== state));
    } else {
      setSelectedStates([...selectedStates, state]);
    }
  };

  // Center map on a specific location
  const centerMapOnLocation = (location: Location) => {
    if (map) {
      map.setCenter({
        lat: location.latitude,
        lng: location.longitude
      });
      map.setZoom(12);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Location Search</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filter sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-t-4 border-t-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 text-red-500 mr-2" />
                Location Search
              </CardTitle>
              <p className="text-sm text-gray-500">Find shelter dogs by location</p>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="city" className="text-sm font-medium mb-1.5 block">City</Label>
                <div className="relative">
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city name"
                    className="pl-8"
                  />
                  <div className="absolute left-2.5 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-1.5 block">States</Label>
                <div className="bg-gray-50 rounded-md p-3 border">
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
                    {US_STATES.map((state) => (
                      <div
                        key={state}
                        className={`flex items-center space-x-2 p-1.5 rounded-md cursor-pointer transition-colors ${
                          selectedStates.includes(state) ? 'bg-red-50' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => toggleState(state)}
                      >
                        <Checkbox
                          id={`state-${state}`}
                          checked={selectedStates.includes(state)}
                          className={selectedStates.includes(state) ? 'text-red-500 border-red-500' : ''}
                        />
                        <label
                          htmlFor={`state-${state}`}
                          className={`text-sm font-medium leading-none cursor-pointer ${
                            selectedStates.includes(state) ? 'text-red-700' : ''
                          }`}
                        >
                          {state}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedStates.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between items-center">
                      <span className="text-xs text-gray-500">{selectedStates.length} states selected</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => setSelectedStates([])}
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-map-bounds"
                    checked={useMapBounds}
                    onCheckedChange={(checked) => setUseMapBounds(checked === true)}
                    className={useMapBounds ? 'text-blue-500 border-blue-500' : ''}
                  />
                  <label
                    htmlFor="use-map-bounds"
                    className="text-sm font-medium leading-none text-blue-700 cursor-pointer"
                  >
                    Use current map view as search area
                  </label>
                </div>
                <p className="text-xs text-blue-600 mt-1.5 ml-6">
                  When enabled, only locations within the current map view will be shown
                </p>
              </div>

              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={applyFilters}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    "Search Locations"
                  )}
                </Button>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="flex-none px-4"
                  disabled={isSearching}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                    <path d="M3 3v5h5"/>
                  </svg>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results list */}
          {locationData && locationData.results.length > 0 && (
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Locations ({totalResults})</CardTitle>
                  <span className="text-xs text-gray-500">Click to view on map</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {locationData.results.map((location) => (
                    <div
                      key={location.zip_code}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedLocation?.zip_code === location.zip_code
                          ? 'bg-red-50 border-red-200 shadow-sm'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedLocation(location);
                        centerMapOnLocation(location);
                      }}
                    >
                      <div className="flex items-start">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
                          selectedLocation?.zip_code === location.zip_code
                            ? 'bg-red-100'
                            : 'bg-gray-100'
                        }`}>
                          <MapPin className={`h-4 w-4 ${
                            selectedLocation?.zip_code === location.zip_code
                              ? 'text-red-500'
                              : 'text-gray-500'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{location.city}, {location.state}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <span className="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs font-medium mr-2">
                              {location.zip_code}
                            </span>
                            <span>{location.county} County</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Map container */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-12rem)] border-t-4 border-t-blue-500 overflow-hidden">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mr-2">
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
                  <line x1="9" x2="9" y1="3" y2="18"/>
                  <line x1="15" x2="15" y1="6" y2="21"/>
                </svg>
                Interactive Map
              </CardTitle>
              {locationData && locationData.results.length > 0 && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium mr-2">
                    {locationData.results.length} locations
                  </span>
                  {useMapBounds && (
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-medium">
                      Map bounds active
                    </span>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-56px)] relative">
              {!isLoaded ? (
                <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                  <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                  <span className="text-gray-600 font-medium">Loading Google Maps...</span>
                  <p className="text-gray-400 text-sm mt-2">This may take a moment</p>
                </div>
              ) : loadError ? (
                <div className="flex flex-col items-center justify-center h-full bg-red-50">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" x2="12" y1="8" y2="12"/>
                      <line x1="12" x2="12.01" y1="16" y2="16"/>
                    </svg>
                  </div>
                  <span className="text-red-600 font-medium">Error loading Google Maps</span>
                  <p className="text-red-400 text-sm mt-2">Please check your internet connection and try again</p>
                  <Button
                    variant="outline"
                    className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => window.location.reload()}
                  >
                    Reload Page
                  </Button>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={defaultCenter}
                  zoom={4}
                  onLoad={onMapLoad}
                  onBoundsChanged={onBoundsChanged}
                  options={{
                    mapTypeControl: true,
                    streetViewControl: false,
                    fullscreenControl: true,
                    styles: mapStyles,
                    mapTypeId: 'roadmap',
                    zoomControlOptions: {
                      position: google.maps.ControlPosition.RIGHT_TOP
                    }
                  }}
                >
                  {/* Render markers for each location */}
                  {locationData && locationData.results.map((location) => (
                    <Marker
                      key={location.zip_code}
                      position={{
                        lat: location.latitude,
                        lng: location.longitude
                      }}
                      title={`${location.city}, ${location.state} (${location.zip_code})`}
                      onClick={() => handleMarkerClick(location)}
                      animation={google.maps.Animation.DROP}
                      icon={{
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        `),
                        scaledSize: new google.maps.Size(36, 36),
                        anchor: new google.maps.Point(18, 36),
                      }}
                    />
                  ))}

                  {/* Visualize the search area when using map bounds */}
                  {useMapBounds && mapBounds && (
                    <Rectangle
                      bounds={{
                        north: mapBounds.north,
                        south: mapBounds.south,
                        east: mapBounds.east,
                        west: mapBounds.west
                      }}
                      options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.1
                      }}
                    />
                  )}

                  {/* Selected location info window */}
                  {selectedLocation && (
                    <InfoWindow
                      position={{
                        lat: selectedLocation.latitude,
                        lng: selectedLocation.longitude
                      }}
                      onCloseClick={() => setSelectedLocation(null)}
                      options={{
                        pixelOffset: new google.maps.Size(0, -40),
                        maxWidth: 320
                      }}
                    >
                      <div className="p-3 max-w-xs">
                        <div className="flex items-center mb-2">
                          <MapPin className="h-5 w-5 text-red-500 mr-2" />
                          <h3 className="font-bold text-lg text-gray-800">
                            {selectedLocation.city}, {selectedLocation.state}
                          </h3>
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-1">
                              <span className="text-xs uppercase text-gray-500 font-medium">ZIP Code</span>
                              <p className="text-sm font-medium">{selectedLocation.zip_code}</p>
                            </div>
                            <div className="col-span-1">
                              <span className="text-xs uppercase text-gray-500 font-medium">County</span>
                              <p className="text-sm font-medium">{selectedLocation.county}</p>
                            </div>
                          </div>

                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <span className="text-xs uppercase text-gray-500 font-medium">Coordinates</span>
                            <p className="text-sm font-mono">
                              {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex justify-between">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`, '_blank')}
                          >
                            Open in Google Maps
                          </Button>
                          <Button
                            size="sm"
                            className="text-xs bg-red-500 hover:bg-red-600"
                          >
                            Find Dogs Here
                          </Button>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              )}

              {/* Loading overlay for search */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
                      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-1">Searching Locations</h3>
                    <p className="text-gray-500 text-sm mb-4">Finding the perfect spots for shelter dogs...</p>
                    <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LocationSearchPage;
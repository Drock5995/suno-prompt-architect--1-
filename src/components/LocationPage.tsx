import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

interface VisitorLocation {
  id: string;
  session_id: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const LocationPage: React.FC = () => {
  const [locations, setLocations] = useState<VisitorLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('visitor_locations')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleLocationClick = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/@${lat},${lng},15z`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-spotify-gray-100 flex flex-col items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
        <h2 className="text-2xl font-bold mt-4">Loading Locations...</h2>
      </div>
    );
  }

  const handleAddTestLocation = async () => {
    try {
      const { error } = await supabase
        .from('visitor_locations')
        .insert({ session_id: 'test-session', latitude: 37.7749, longitude: -122.4194 }); // San Francisco
      if (error) throw error;
      // Refetch locations
      fetchLocations();
    } catch (error) {
      console.error('Error adding test location:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-4xl font-bold mb-8 text-white">Visitor Locations</h2>
      <button
        onClick={handleAddTestLocation}
        className="mb-4 bg-spotify-green text-black px-4 py-2 rounded hover:bg-green-400"
      >
        Add Test Location
      </button>
      {locations.length === 0 ? (
        <p className="text-spotify-gray-100">No visitor locations recorded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-spotify-gray-400 p-4 rounded-lg cursor-pointer hover:bg-spotify-gray-300 transition-colors"
              onClick={() => handleLocationClick(location.latitude, location.longitude)}
            >
              <p className="text-white font-semibold">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
              <p className="text-spotify-gray-100 text-sm">
                {new Date(location.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPage;

import React, { useState, useEffect } from 'react';
import { SegmentedSearchBar } from '../components/search/SegmentedSearchBar';
import { AmenityFilterRow } from '../components/search/AmenityFilterRow';
import { FiltersModal } from '../components/search/FiltersModal';
import { ListingGrid } from '../components/listings/ListingGrid';
import { LeafletMapView } from '../components/map/LeafletMapView';
import { Property, FilterState, VerticalType } from '../types';
import { dataService } from '../lib/supabase';
import { useRealtimeSync } from '../lib/realtimeSync';
import { Shield, Compass, Award } from 'lucide-react';

interface HomePageProps {
  activeVertical: VerticalType;
  onVerticalChange: (v: VerticalType) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ activeVertical, onVerticalChange }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    minPrice: 0,
    maxPrice: 2000,
    selectedAmenities: [],
    vertical: activeVertical
  });

  // Subscribe to live database updates across all devices
  useRealtimeSync(['properties'], () => {
    loadProperties();
  });

  useEffect(() => {
    setFilters(prev => ({ ...prev, vertical: activeVertical }));
    loadProperties();
  }, [activeVertical, filters.destination, filters.selectedAmenities.join(',')]);

  const loadProperties = async () => {
    setLoading(true);
    try {
      let data = await dataService.getProperties(
        activeVertical,
        filters.destination
      );
      if (filters.selectedAmenities.length > 0) {
        data = data.filter(p =>
          filters.selectedAmenities.every(a => p.amenities.includes(a))
        );
      }
      setProperties(data);
    } catch (err) {
      console.error('Failed to load listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleToggleAmenity = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.selectedAmenities.includes(amenity);
      return {
        ...prev,
        selectedAmenities: exists
          ? prev.selectedAmenities.filter(a => a !== amenity)
          : [...prev.selectedAmenities, amenity]
      };
    });
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Full-Page Width Top Search Bar Container */}
      <div className="w-full border-b border-purple-100/60 shadow-sm py-8 sm:py-12 px-3 sm:px-4 bg-pattern relative z-30">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center relative z-10">
          <SegmentedSearchBar
            filters={{ ...filters, vertical: activeVertical }}
            onSearch={handleSearch}
            onVerticalChange={onVerticalChange}
          />
        </div>
      </div>

      {/* Quick Amenity / Feature Filters Chip Bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-20 z-20">
        <AmenityFilterRow
          selectedAmenities={filters.selectedAmenities}
          onToggleAmenity={handleToggleAmenity}
          onOpenFiltersModal={() => setShowFiltersModal(true)}
          activeVertical={activeVertical}
        />
      </div>

      {/* Main Content Area */}
      <main className="min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Loading Luxury Listings...</p>
          </div>
        ) : isMapView ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-navy-950">Interactive Map View</h2>
              <button
                onClick={() => setIsMapView(false)}
                className="text-xs font-extrabold text-amber-600 hover:underline"
              >
                Switch to Grid View &rarr;
              </button>
            </div>
            <LeafletMapView properties={properties} height="600px" />
          </div>
        ) : (
          <ListingGrid
            properties={properties}
            onToggleMapView={() => setIsMapView(!isMapView)}
            isMapView={isMapView}
          />
        )}
      </main>

      {/* Trust & Quality Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#2E0854] flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-navy-950">100% Verified Properties</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Every apartment in the Reetay portfolio is physically inspected to guarantee linen quality, power backup, and 24/7 security.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#2E0854] flex items-center justify-center flex-shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-navy-950">Concierge Services</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Dedicated 24/7 guest relations, private airport transfers, and chef services available on demand.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#2E0854] flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-navy-950">Best Price Guarantee</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Direct booking pricing without hidden portal commissions or markups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Full Filters Modal */}
      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        selectedAmenities={filters.selectedAmenities}
        onApplyFilters={(amenities, min, max) =>
          setFilters(prev => ({
            ...prev,
            selectedAmenities: amenities,
            minPrice: min,
            maxPrice: max
          }))
        }
        activeVertical={activeVertical}
      />
    </div>
  );
};

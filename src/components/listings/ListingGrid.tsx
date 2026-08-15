import React, { useState } from 'react';
import { Property } from '../../types';
import { ListingCard } from './ListingCard';
import { Map, LayoutGrid, Sparkles, ArrowUp } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface ListingGridProps {
  properties: Property[];
  onToggleMapView?: () => void;
  isMapView?: boolean;
}

export const ListingGrid: React.FC<ListingGridProps> = ({
  properties,
  onToggleMapView,
  isMapView = false
}) => {
  const [visibleCount, setVisibleCount] = useState(12);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const visibleProperties = properties.slice(0, visibleCount);
  const hasMore = visibleCount < properties.length;

  if (properties.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          icon={Sparkles}
          headline="No listings found matching your search"
          helperText="Try adjusting your destination, date range, or amenity filters to discover available luxury options."
          ctaText="Reset Search"
          onCtaClick={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">

      {/* 4-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleProperties.map((property) => (
          <ListingCard key={property.id} property={property} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={handleLoadMore}
            className="px-8 py-3.5 rounded-full bg-navy-950 text-white hover:bg-black border border-navy-950 shadow-md text-sm font-extrabold active:scale-95 transition-all"
          >
            Load More Listings
          </button>
        </div>
      )}

      {/* Floating Round Scroll to Top Button (Bottom Right, No Text) */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-[#2E0854] hover:bg-black text-white shadow-2xl border border-purple-900/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 stroke-[2.5]" />
      </button>
    </div>
  );
};

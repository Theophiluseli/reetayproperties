import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, MapPin, Users, Bed, DoorClosed, Bath, ChevronLeft, ChevronRight, Fuel, Sliders, Star, ArrowRight } from 'lucide-react';
import { Property } from '../../types';
import { ShareModal } from '../common/ShareModal';

interface ListingCardProps {
  property: Property;
}

export const ListingCard: React.FC<ListingCardProps> = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const isCar = property.vertical === 'cars';

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const openShareModal = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareModalOpen(true);
  };

  return (
    <>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden h-full">
        
        {/* Top Image Container */}
        <div className="relative aspect-square w-full bg-gray-100 rounded-3xl overflow-hidden">
          <img
            src={property.images[currentImageIndex]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Carousel Arrows */}
          {property.images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                type="button"
                onClick={handlePrevImage}
                className="w-8 h-8 rounded-full bg-white/90 text-navy-950 flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="w-8 h-8 rounded-full bg-white/90 text-navy-950 flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Top-Left Rating Star Badge (if rated) */}
          {property.rating >= 4.9 && (
            <div className="absolute top-4 left-4 z-10">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-white/95 text-navy-950 shadow-md flex items-center gap-1 border border-gray-100">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{property.rating.toFixed(1)}</span>
                <span className="text-gray-400 font-normal">({property.review_count || 1})</span>
              </span>
            </div>
          )}

          {/* Top-Right Action Buttons: Share & Heart */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              type="button"
              onClick={openShareModal}
              className="w-9 h-9 rounded-full bg-white/95 text-navy-950 flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all"
              title="Share listing"
            >
              <Share2 className="w-4 h-4 text-gray-700" />
            </button>
            <button
              type="button"
              onClick={toggleFavorite}
              className="w-9 h-9 rounded-full bg-white/95 text-navy-950 flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all"
              title="Favorite listing"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <Link to={`/stays/${property.id}`} className="p-4 sm:p-5 flex flex-col flex-1 justify-between space-y-3">
          <div className="space-y-2">
            {/* Title */}
            <h3 className="font-extrabold text-[#2E0854] text-sm sm:text-base group-hover:text-black transition-colors line-clamp-1">
              {property.title}
            </h3>

            {/* Location Line (Matching User Screenshot) */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{property.location.address || `${property.location.area}, ${property.location.city}`}</span>
            </div>

            {/* Small Portion of About / Description */}
            {property.description && (
              <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed font-normal pt-0.5">
                {property.description}
              </p>
            )}

            {/* Specs Row */}
            {isCar ? (
              <div className="flex items-center gap-3 text-xs text-gray-600 font-bold whitespace-nowrap pt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{property.max_guests}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-gray-400" />
                  <span>{property.fuel_type || 'Petrol'}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-gray-400" />
                  <span>{property.transmission || 'Automatic'}</span>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-xs text-gray-600 font-bold whitespace-nowrap pt-1">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-gray-400" />
                  <span>{property.max_guests}</span>
                </span>
                <span className="flex items-center gap-1">
                  <DoorClosed className="w-3.5 h-3.5 text-gray-400" />
                  <span>{property.bedrooms}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5 text-gray-400" />
                  <span>{property.beds}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5 text-gray-400" />
                  <span>{property.bathrooms}</span>
                </span>
              </div>
            )}

            {/* Feature Tag Chips */}
            {isCar && property.amenities.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {property.amenities.slice(0, 2).map((feat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 truncate max-w-[130px]"
                  >
                    {feat}
                  </span>
                ))}
                {property.amenities.length > 2 && (
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">
                    +{property.amenities.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Price Row & View Details with Arrow */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-baseline gap-1">
              <span className="font-black text-xl sm:text-2xl text-[#2E0854]">${property.price_per_night}</span>
              <span className="text-xs text-gray-500 font-semibold">
                {property.price_unit_label || (isCar ? 'Starting from' : 'per night')}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-black text-navy-950 group-hover:text-black transition-colors">
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </div>

      {/* Share Modal Trigger */}
      <ShareModal
        property={property}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </>
  );
};

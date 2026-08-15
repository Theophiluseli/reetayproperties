import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { Property } from '../../types';
import { ListingCard } from '../../components/listings/ListingCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const MyFavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    dataService.getFavorites().then(setFavorites);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-950">My Wishlist & Favorites</h1>
        <p className="text-xs text-gray-500 font-medium">Saved luxury residences and experiences</p>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((prop) => (
            <ListingCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          headline="No favorites saved"
          helperText="Heart properties while exploring to save them here for quick booking later."
          ctaText="Explore Properties"
          onCtaClick={() => navigate('/')}
        />
      )}
    </div>
  );
};

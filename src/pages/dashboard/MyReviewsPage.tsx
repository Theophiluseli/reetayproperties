import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { Review } from '../../types';
import { EmptyState } from '../../components/common/EmptyState';
import { Star, MessageSquare } from 'lucide-react';

export const MyReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    dataService.getReviews().then(setReviews);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy-950">My Ratings & Reviews</h1>
        <p className="text-xs text-gray-500 font-medium">Feedback submitted for past stays</p>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-extrabold text-navy-950">{rev.property_title}</h3>
                <div className="flex text-gold-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-500" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 font-light leading-relaxed">{rev.comment}</p>
              <span className="text-[10px] text-gray-400 font-medium block">Submitted on {rev.created_at}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Star}
          headline="No reviews submitted yet"
          helperText="You can submit reviews after completing a stay."
        />
      )}
    </div>
  );
};

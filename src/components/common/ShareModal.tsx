import React, { useState } from 'react';
import { Property } from '../../types';
import {
  Share2,
  X,
  Copy,
  Check,
  Printer,
  Mail,
  Linkedin,
  Twitter,
  Facebook,
  MessageCircle
} from 'lucide-react';

interface ShareModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ property, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this luxury stay: ${property.title}`,
          url: currentUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out ${property.title} on Reetay Properties: ${currentUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`Check out ${property.title} on Reetay Properties`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${text}`, '_blank');
  };

  const handleShareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`Check out ${property.title}`);
    const body = encodeURIComponent(`I found this luxury apartment on Reetay Properties:\n\n${property.title}\n${currentUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-navy-950 text-base">Share this listing</h3>
              <p className="text-xs text-gray-400 font-medium">Share this stay with friends and family</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-navy-950 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Share Via Native Button */}
        <button
          onClick={handleNativeShare}
          className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>Share via...</span>
        </button>

        {/* 6 Color-Coded Grid Buttons */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-navy-950 block">Share via</span>
          <div className="grid grid-cols-3 gap-3">
            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="py-4 px-3 rounded-2xl bg-[#25D366] hover:brightness-105 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <MessageCircle className="w-6 h-6 fill-current" />
              <span>WhatsApp</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              className="py-4 px-3 rounded-2xl bg-[#1877F2] hover:brightness-105 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Facebook className="w-6 h-6 fill-current" />
              <span>Facebook</span>
            </button>

            {/* Twitter */}
            <button
              onClick={handleShareTwitter}
              className="py-4 px-3 rounded-2xl bg-[#1DA1F2] hover:brightness-105 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Twitter className="w-6 h-6 fill-current" />
              <span>Twitter</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleShareLinkedIn}
              className="py-4 px-3 rounded-2xl bg-[#0A66C2] hover:brightness-105 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Linkedin className="w-6 h-6 fill-current" />
              <span>LinkedIn</span>
            </button>

            {/* Email */}
            <button
              onClick={handleShareEmail}
              className="py-4 px-3 rounded-2xl bg-[#4A5568] hover:brightness-105 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Mail className="w-6 h-6" />
              <span>Email</span>
            </button>

            {/* Print */}
            <button
              onClick={handlePrint}
              className="py-4 px-3 rounded-2xl bg-[#8B5CF6] hover:brightness-105 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Printer className="w-6 h-6" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Copy Link Section */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-navy-950 block">Or copy link</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-medium text-gray-700 outline-none select-all"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-navy-950 font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Card */}
        <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 flex flex-col gap-2">
          <div className="h-36 rounded-xl overflow-hidden bg-gray-200 relative">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-1 space-y-0.5">
            <h4 className="font-extrabold text-navy-950 text-sm line-clamp-1">{property.title}</h4>
            <p className="text-[11px] text-gray-500 font-medium">Discover this listing on Reetay.com</p>
          </div>
        </div>

      </div>
    </div>
  );
};

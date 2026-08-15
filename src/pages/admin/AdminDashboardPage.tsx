import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { Property, Booking, User, VerticalType } from '../../types';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Building,
  DollarSign,
  Package,
  Users,
  CheckCircle,
  X,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  Calendar,
  Lock,
  UserCheck,
  Edit2,
  Check,
  Bed,
  Car,
  Tag,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminDashboardPageProps {
  adminUser: User | null;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ adminUser }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings'>('bookings');
  const [inventoryVerticalFilter, setInventoryVerticalFilter] = useState<'all' | VerticalType>('all');
  
  // Modals state
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);

  // Listing Form State
  const [propTitle, setPropTitle] = useState('');
  const [propArea, setPropArea] = useState('Airport Residential');
  const [propCity, setPropCity] = useState('Accra');
  const [propPrice, setPropPrice] = useState(300);
  const [propUnitLabel, setPropUnitLabel] = useState('Starting from');
  const [propVertical, setPropVertical] = useState<VerticalType>('stays');
  const [propBadge, setPropBadge] = useState('Summer Deals');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');
  const [propDescription, setPropDescription] = useState('');

  // Car specific state
  const [propFuelType, setPropFuelType] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>('Petrol');
  const [propTransmission, setPropTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [propVehicleType, setPropVehicleType] = useState<'Sedan' | 'SUV' | 'Van' | 'Minibus' | 'Luxury' | 'Crossover'>('SUV');
  const [propPickupLocations, setPropPickupLocations] = useState('Accra, Kumasi, Sunyani, Takoradi');
  const [propDropoffLocations, setPropDropoffLocations] = useState('Cape Coast, Ho, Wa, Sunyani, Accra');

  // Stays specific state
  const [propMaxGuests, setPropMaxGuests] = useState(4);
  const [propBedrooms, setPropBedrooms] = useState(2);
  const [propBeds, setPropBeds] = useState(2);
  const [propBathrooms, setPropBathrooms] = useState(2);

  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Walk-in Booking Form State
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [walkInName, setWalkInName] = useState('');
  const [walkInEmail, setWalkInEmail] = useState('');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [walkInCheckIn, setWalkInCheckIn] = useState('2026-09-15');
  const [walkInCheckOut, setWalkInCheckOut] = useState('2026-09-18');
  const [walkInGuests, setWalkInGuests] = useState(2);
  const [walkInPrice, setWalkInPrice] = useState(750);
  const [walkInRequests, setWalkInRequests] = useState('Walk-in reception guest reservation.');
  const [walkInPaymentStatus, setWalkInPaymentStatus] = useState<'paid' | 'pending'>('paid');
  const [walkInError, setWalkInError] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    const p = await dataService.getProperties('stays');
    const c = await dataService.getProperties('cars');
    const e = await dataService.getProperties('experiences');
    const b = await dataService.getBookings();
    const allProps = [...p, ...c, ...e];
    setProperties(allProps);
    setBookings(b);
    if (allProps.length > 0 && !selectedPropertyId) {
      setSelectedPropertyId(allProps[0].id);
    }
  };

  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            const res = reader.result;
            setGalleryImages(prev => [...prev, res]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleAddGalleryUrl = () => {
    if (newGalleryUrlInput.trim()) {
      setGalleryImages(prev => [...prev, newGalleryUrlInput.trim()]);
      setNewGalleryUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleOpenAddModal = () => {
    setEditingProperty(null);
    setPropTitle('');
    setPropVertical('cars');
    setPropPrice(95);
    setPropUnitLabel('Starting from');
    setPropArea('Airport Residential');
    setPropCity('Accra');
    setCoverImage('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80');
    setGalleryImages([
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
    ]);
    setNewGalleryUrlInput('');
    setPropDescription('Executive rental listing managed by platform administration.');
    setPropBadge('Summer Deals');
    setPropFuelType('Petrol');
    setPropTransmission('Automatic');
    setPropVehicleType('SUV');
    setPropPickupLocations('Accra, Kumasi, Sunyani, Takoradi');
    setPropDropoffLocations('Cape Coast, Ho, Wa, Sunyani, Accra');
    setPropMaxGuests(5);
    setPropBedrooms(0);
    setPropBeds(0);
    setPropBathrooms(0);
    setSelectedAmenities(['GPS', 'Air-condition', 'Bluetooth audio connectivity', 'Spacious seating & clean interiors']);
    setShowPropertyModal(true);
  };

  const handleOpenEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setPropTitle(prop.title);
    setPropVertical(prop.vertical);
    setPropPrice(prop.price_per_night);
    setPropUnitLabel(prop.price_unit_label || (prop.vertical === 'cars' ? 'Starting from' : 'per night'));
    setPropArea(prop.location.area);
    setPropCity(prop.location.city);
    setCoverImage(prop.images[0] || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80');
    setGalleryImages(prop.images.slice(1) || []);
    setNewGalleryUrlInput('');
    setPropDescription(prop.description);
    setPropBadge(prop.badge || 'Summer Deals');
    setPropFuelType(prop.fuel_type || 'Petrol');
    setPropTransmission(prop.transmission || 'Automatic');
    setPropVehicleType(prop.vehicle_type || 'SUV');
    setPropPickupLocations(prop.pickup_locations?.join(', ') || 'Accra, Kumasi, Sunyani, Takoradi');
    setPropDropoffLocations(prop.dropoff_locations?.join(', ') || 'Cape Coast, Ho, Wa, Sunyani, Accra');
    setPropMaxGuests(prop.max_guests || 4);
    setPropBedrooms(prop.bedrooms || 0);
    setPropBeds(prop.beds || 0);
    setPropBathrooms(prop.bathrooms || 0);
    setSelectedAmenities(prop.amenities || []);
    setShowPropertyModal(true);
  };

  const handleSaveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    const allImages = [coverImage, ...galleryImages].filter(Boolean);
    const payload: Partial<Property> = {
      title: propTitle || 'Luxury Listing',
      description: propDescription || 'Luxury platform listing.',
      vertical: propVertical,
      price_per_night: propPrice,
      price_unit_label: propUnitLabel,
      location: {
        city: propCity,
        area: propArea,
        address: `${propArea}, ${propCity}`,
        lat: 5.6037,
        lng: -0.1870
      },
      max_guests: propMaxGuests,
      bedrooms: propVertical === 'stays' ? propBedrooms : 0,
      beds: propVertical === 'stays' ? propBeds : 0,
      bathrooms: propVertical === 'stays' ? propBathrooms : 0,
      fuel_type: propVertical === 'cars' ? propFuelType : undefined,
      transmission: propVertical === 'cars' ? propTransmission : undefined,
      vehicle_type: propVertical === 'cars' ? propVehicleType : undefined,
      pickup_locations: propVertical === 'cars' ? propPickupLocations.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      dropoff_locations: propVertical === 'cars' ? propDropoffLocations.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      amenities: selectedAmenities,
      badge: propBadge,
      images: allImages.length > 0 ? allImages : ['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80']
    };

    if (editingProperty) {
      await dataService.updateProperty(editingProperty.id, payload);
      alert('Listing updated successfully!');
    } else {
      await dataService.createProperty(payload);
      alert('New listing published to platform!');
    }

    setShowPropertyModal(false);
    loadAdminData();
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setWalkInError('');
    try {
      await dataService.createWalkInBooking({
        propertyId: selectedPropertyId,
        guest_name: walkInName,
        guest_email: walkInEmail,
        guest_phone: walkInPhone,
        checkIn: walkInCheckIn,
        checkOut: walkInCheckOut,
        guests: walkInGuests,
        totalPrice: walkInPrice,
        special_requests: walkInRequests,
        payment_status: walkInPaymentStatus
      });
      setShowWalkInModal(false);
      setWalkInName('');
      setWalkInEmail('');
      setWalkInPhone('');
      loadAdminData();
      alert('Walk-in booking registered! Dates are now locked on the front-end calendar.');
    } catch (err: any) {
      setWalkInError(err.message || 'Error recording walk-in booking');
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'upcoming' | 'active' | 'completed' | 'cancelled') => {
    await dataService.updateBookingStatus(bookingId, newStatus);
    loadAdminData();
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to remove this property listing?')) {
      await dataService.deleteProperty(id);
      loadAdminData();
    }
  };

  const handleToggleStatus = async (id: string) => {
    await dataService.togglePropertyStatus(id);
    loadAdminData();
  };

  const filteredProperties = properties.filter(p => {
    if (inventoryVerticalFilter === 'all') return true;
    return p.vertical === inventoryVerticalFilter;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-navy-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-extrabold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin Console</span>
          </div>
          <h1 className="text-3xl font-black">Reetay Executive Operations</h1>
          <p className="text-xs text-gray-300">Logged in as {adminUser?.full_name || 'Platform Administrator'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowWalkInModal(true)}
            className="px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <UserCheck className="w-4 h-4" />
            <span>Record Walk-in Booking</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Listing</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Gross Platform Revenue</span>
          <div className="text-3xl font-black text-navy-950 mt-2">${totalRevenue}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Includes Walk-ins & Online</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Active Inventory</span>
          <div className="text-3xl font-black text-navy-950 mt-2">{properties.length}</div>
          <span className="text-[10px] text-gray-400 font-bold">Stays, Cars & Experiences</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Reservations</span>
          <div className="text-3xl font-black text-navy-950 mt-2">{bookings.length}</div>
          <span className="text-[10px] text-amber-600 font-bold">Front-End Calendar Sync Active</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Calendar Lock Guard</span>
          <div className="text-3xl font-black text-emerald-600 mt-2 flex items-center gap-2">
            <Lock className="w-6 h-6" />
            <span>Active</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">Instant Overlap Prevention</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
            activeTab === 'bookings' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950'
          }`}
        >
          Guest Bookings & Customer Follow-up ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
            activeTab === 'listings' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950'
          }`}
        >
          Properties & Fleet Inventory ({properties.length})
        </button>
      </div>

      {/* Tab 1: Bookings & Customer Follow-up Table */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-navy-950">Incoming Reservations & Guest CRM</h3>
              <p className="text-xs text-gray-500">Track online & walk-in guests, update reservation status, and initiate WhatsApp/Email follow-up</p>
            </div>
            <button
              onClick={() => setShowWalkInModal(true)}
              className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold hover:bg-emerald-100 flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>New Walk-in Guest</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                <tr>
                  <th className="p-4">Ref & Type</th>
                  <th className="p-4">Guest Contact Info</th>
                  <th className="p-4">Residence / Vehicle</th>
                  <th className="p-4">Stay Dates</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status & Action</th>
                  <th className="p-4 text-right">Customer Follow-up</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
                {bookings.map((b) => {
                  const cleanPhone = b.guest_phone ? b.guest_phone.replace(/[^0-9]/g, '') : '';
                  const waText = encodeURIComponent(`Hello ${b.guest_name}, this is Reetay Apartments Concierge regarding your reservation ${b.id} for ${b.property.title}.`);
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="p-4">
                        <span className="font-mono font-black text-gold-600 block">{b.id}</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          b.booking_type === 'walk_in' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {b.booking_type === 'walk_in' ? 'Walk-In Desk' : 'Online Booking'}
                        </span>
                      </td>

                      <td className="p-4">
                        <p className="font-extrabold text-navy-950">{b.guest_name}</p>
                        <p className="text-gray-400 text-[11px]">{b.guest_email}</p>
                        <p className="text-gray-500 text-[11px] font-mono">{b.guest_phone}</p>
                        {b.special_requests && (
                          <p className="text-[10px] text-gray-400 italic mt-0.5 line-clamp-1">"{b.special_requests}"</p>
                        )}
                      </td>

                      <td className="p-4 font-extrabold max-w-xs truncate">{b.property.title}</td>

                      <td className="p-4">
                        <span>{b.check_in} &rarr; {b.check_out}</span>
                        <span className="block text-[10px] text-gray-400 font-medium">{b.guests} Guests</span>
                      </td>

                      <td className="p-4 font-black">
                        {b.currency}{b.total_price}
                        <span className="block text-[10px] uppercase font-bold text-emerald-600">{b.payment_status}</span>
                      </td>

                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                          className="bg-gray-100 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-navy-950 outline-none cursor-pointer"
                        >
                          <option value="upcoming">Upcoming</option>
                          <option value="active">Active (Checked In)</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled (Unlock Dates)</option>
                        </select>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        {cleanPhone && (
                          <a
                            href={`https://wa.me/${cleanPhone}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] shadow-sm"
                            title="Send WhatsApp Follow-up Message"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        <a
                          href={`mailto:${b.guest_email}?subject=Reetay%20Apartments%20Reservation%20${b.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-navy-950 hover:bg-navy-900 text-white font-bold text-[11px] shadow-sm"
                          title="Send Email Follow-up"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Listings Table */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-navy-950">Platform Listings & Fleet Inventory</h3>
              <p className="text-xs text-gray-500 font-medium">Full CRUD control across Stays, Cars, and Experiences</p>
            </div>

            {/* Vertical Pill Filter Bar */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-full text-xs font-extrabold">
              <button
                onClick={() => setInventoryVerticalFilter('all')}
                className={`px-3 py-1.5 rounded-full transition-all ${inventoryVerticalFilter === 'all' ? 'bg-white text-navy-950 shadow-sm' : 'text-gray-500'}`}
              >
                All ({properties.length})
              </button>
              <button
                onClick={() => setInventoryVerticalFilter('stays')}
                className={`px-3 py-1.5 rounded-full transition-all ${inventoryVerticalFilter === 'stays' ? 'bg-white text-navy-950 shadow-sm' : 'text-gray-500'}`}
              >
                Stays ({properties.filter(p => p.vertical === 'stays').length})
              </button>
              <button
                onClick={() => setInventoryVerticalFilter('cars')}
                className={`px-3 py-1.5 rounded-full transition-all ${inventoryVerticalFilter === 'cars' ? 'bg-white text-navy-950 shadow-sm' : 'text-gray-500'}`}
              >
                Cars ({properties.filter(p => p.vertical === 'cars').length})
              </button>
              <button
                onClick={() => setInventoryVerticalFilter('experiences')}
                className={`px-3 py-1.5 rounded-full transition-all ${inventoryVerticalFilter === 'experiences' ? 'bg-white text-navy-950 shadow-sm' : 'text-gray-500'}`}
              >
                Experiences ({properties.filter(p => p.vertical === 'experiences').length})
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                <tr>
                  <th className="p-4">Property / Fleet</th>
                  <th className="p-4">Vertical</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price & Label</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
                {filteredProperties.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <p className="font-extrabold text-navy-950">{p.title}</p>
                        {p.badge && <span className="text-[9px] font-bold text-gold-600 uppercase">{p.badge}</span>}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        p.vertical === 'cars' ? 'bg-indigo-100 text-indigo-800' : p.vertical === 'stays' ? 'bg-purple-100 text-purple-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.vertical}
                      </span>
                    </td>

                    <td className="p-4">{p.location.area}, {p.location.city}</td>

                    <td className="p-4 font-black">
                      ${p.price_per_night}
                      <span className="block text-[10px] text-gray-400 font-normal">{p.price_unit_label || (p.vertical === 'cars' ? 'Starting from' : 'per night')}</span>
                    </td>

                    <td className="p-4">⭐ {p.rating.toFixed(1)}</td>

                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                          p.status === 'published' ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p.status || 'published'}
                      </button>
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg bg-gray-100 hover:bg-gold-100 text-navy-950 hover:text-gold-700 transition-all inline-flex items-center gap-1 text-[11px] font-bold"
                        title="Edit Listing"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-gold-600" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(p.id)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all inline-flex items-center gap-1 text-[11px] font-bold"
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add or Edit Property/Vehicle Listing */}
      {showPropertyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 border border-gray-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-navy-950 text-base">
                {editingProperty ? `Edit Listing: ${editingProperty.title}` : 'Add New Listing / Vehicle'}
              </h3>
              <button onClick={() => setShowPropertyModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-4">
              {/* Select Vertical */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Select Vertical Category</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPropVertical('stays')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'stays' ? 'bg-navy-950 text-white border-navy-950' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Bed className="w-4 h-4 text-gold-400" />
                    <span>Stays</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropVertical('cars')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'cars' ? 'bg-navy-950 text-white border-navy-950' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Car className="w-4 h-4 text-gold-400" />
                    <span>Cars</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropVertical('experiences')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'experiences' ? 'bg-navy-950 text-white border-navy-950' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Sparkles className="w-4 h-4 text-gold-400" />
                    <span>Experiences</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Listing Title</label>
                <input
                  type="text"
                  placeholder={propVertical === 'cars' ? 'e.g. Toyota Land Cruiser 300 - Executive Fleet' : 'e.g. Roman Ridge Skyline Penthouse'}
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  required
                />
              </div>

              {/* Price & Unit Label */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={propPrice}
                    onChange={(e) => setPropPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-purple-900 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Price Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Starting from / per night"
                    value={propUnitLabel}
                    onChange={(e) => setPropUnitLabel(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
              </div>

              {/* Vehicle specific fields */}
              {propVertical === 'cars' && (
                <div className="space-y-3 bg-purple-50/50 p-4 rounded-2xl border border-purple-100">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-purple-950 block mb-1">Vehicle Category</label>
                      <select
                        value={propVehicleType}
                        onChange={(e) => setPropVehicleType(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-navy-950 outline-none"
                      >
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Van">Van</option>
                        <option value="Minibus">Minibus</option>
                        <option value="Crossover">Crossover</option>
                        <option value="Luxury">Luxury</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-purple-950 block mb-1">Transmission</label>
                      <select
                        value={propTransmission}
                        onChange={(e) => setPropTransmission(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-navy-950 outline-none"
                      >
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-purple-950 block mb-1">Fuel Type</label>
                      <select
                        value={propFuelType}
                        onChange={(e) => setPropFuelType(e.target.value as any)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-navy-950 outline-none"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                  </div>

                  {/* Pickup & Dropoff Location Settings */}
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-purple-100">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-purple-950 block mb-1">Available Pickup Locations (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Accra, Kumasi, Sunyani, Takoradi"
                        value={propPickupLocations}
                        onChange={(e) => setPropPickupLocations(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy-950 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] uppercase font-bold text-purple-950 block mb-1">Available Dropoff Locations (Comma-separated)</label>
                      <input
                        type="text"
                        placeholder="e.g. Cape Coast, Ho, Wa, Sunyani, Accra"
                        value={propDropoffLocations}
                        onChange={(e) => setPropDropoffLocations(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy-950 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Location & Guests */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Suburb / Area</label>
                  <input
                    type="text"
                    value={propArea}
                    onChange={(e) => setPropArea(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={propCity}
                    onChange={(e) => setPropCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    {propVertical === 'cars' ? 'Passengers Capacity' : 'Max Guests'}
                  </label>
                  <input
                    type="number"
                    value={propMaxGuests}
                    onChange={(e) => setPropMaxGuests(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
              </div>

              {/* Badge Tag */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Promotional Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Summer Deals"
                  value={propBadge}
                  onChange={(e) => setPropBadge(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                />
              </div>

              {/* Cover Image & Gallery Photos Section */}
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase text-navy-950 block">Listing Cover Image & Gallery</label>
                  <span className="text-[10px] text-gray-400 font-bold">Upload local files or paste image URLs</span>
                </div>

                {/* Cover Image Upload Block */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-navy-950">Primary Cover Image</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded-full uppercase">Cover Photo</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {coverImage ? (
                      <div className="relative w-24 h-20 rounded-xl overflow-hidden border border-gray-200 flex-shrink-0 bg-white">
                        <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-24 h-20 rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 font-bold text-xs flex-shrink-0">
                        No Cover
                      </div>
                    )}

                    <div className="flex-1 w-full space-y-2">
                      <label className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 rounded-xl text-xs font-bold text-navy-950 hover:bg-gray-100 cursor-pointer transition-all shadow-sm">
                        <Upload className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                        <span>Upload Cover Photo</span>
                        <input type="file" accept="image/*" onChange={handleCoverFileUpload} className="hidden" />
                      </label>
                      <div className="text-[10px] text-gray-400 font-semibold">Or paste image URL below:</div>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-navy-950 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Photos Upload Block */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-navy-950">Gallery Photos ({galleryImages.length} uploaded)</span>
                    <label className="inline-flex items-center justify-center px-3 py-1.5 bg-navy-950 text-white rounded-xl text-xs font-bold hover:bg-navy-900 cursor-pointer transition-all shadow-sm">
                      <Plus className="w-3.5 h-3.5 mr-1 text-gold-400" />
                      <span>Upload Gallery Photos</span>
                      <input type="file" accept="image/*" multiple onChange={handleGalleryFilesUpload} className="hidden" />
                    </label>
                  </div>

                  {/* URL Add Row */}
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="Paste photo URL (e.g. https://images.unsplash.com/...)"
                      value={newGalleryUrlInput}
                      onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono text-navy-950 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-xl text-xs font-bold text-navy-950 transition-all"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Gallery Grid Preview */}
                  {galleryImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-2 border-t border-gray-200">
                      {galleryImages.map((imgUrl, idx) => (
                        <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 group bg-white">
                          <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700 transition-all"
                            title="Remove photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Full Description</label>
                <textarea
                  rows={2}
                  value={propDescription}
                  onChange={(e) => setPropDescription(e.target.value)}
                  placeholder="Describe comfort, safety, luggage space, concierge options..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-navy-950 outline-none"
                />
              </div>

              {/* Features & Amenities Checklist */}
              <div className="space-y-2 border-t border-gray-100 pt-3">
                <label className="text-[10px] uppercase font-black text-purple-950 block">Select Features & Amenities</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-36 overflow-y-auto p-2 bg-gray-50 rounded-2xl border border-gray-200">
                  {(propVertical === 'cars'
                    ? [
                        'GPS',
                        'Air-condition',
                        'Bluetooth audio connectivity',
                        'USB / Type-C charging ports',
                        'Spacious seating & clean interiors',
                        'Automatic Transmission',
                        'Chauffeur Included',
                        'Unlimited Mileage',
                        'Leather Seats',
                        'Child Safety Seat'
                      ]
                    : [
                        'Air Conditioning',
                        'Gym & Spa Access',
                        'Private Swimming Pool',
                        'High-Speed WiFi',
                        'Free Underground Parking',
                        'Smart TV & Netflix',
                        'Generator Power Backup',
                        '24/7 Security & Concierge',
                        'Fully Equipped Kitchen'
                      ]
                  ).map((feat) => {
                    const isChecked = selectedAmenities.includes(feat);
                    return (
                      <label key={feat} className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-bold cursor-pointer select-none transition-all ${isChecked ? 'bg-purple-100 border-purple-300 text-purple-950' : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300'}`}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAmenities(prev => [...prev, feat]);
                            } else {
                              setSelectedAmenities(prev => prev.filter(f => f !== feat));
                            }
                          }}
                          className="rounded text-purple-950 focus:ring-purple-500"
                        />
                        <span>{feat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-navy-950 text-white font-black text-xs rounded-xl shadow-md hover:bg-navy-900 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-gold-400" />
                <span>{editingProperty ? 'Update Listing Details' : 'Publish Listing to Platform'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Walk-in Booking */}
      {showWalkInModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-base">Record Walk-in Reservation</h3>
              </div>
              <button onClick={() => setShowWalkInModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {walkInError && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700 font-bold">
                {walkInError}
              </div>
            )}

            <form onSubmit={handleCreateWalkIn} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Select Property</label>
                <select
                  value={selectedPropertyId}
                  onChange={(e) => setSelectedPropertyId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none cursor-pointer"
                  required
                >
                  {properties.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.vertical.toUpperCase()}] {p.title} (${p.price_per_night}) - {p.location.area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guest Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Chief Kwame Mensah"
                  value={walkInName}
                  onChange={(e) => setWalkInName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guest Email</label>
                  <input
                    type="email"
                    placeholder="guest@domain.com"
                    value={walkInEmail}
                    onChange={(e) => setWalkInEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guest Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+233 24 000 0000"
                    value={walkInPhone}
                    onChange={(e) => setWalkInPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={walkInCheckIn}
                    onChange={(e) => setWalkInCheckIn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={walkInCheckOut}
                    onChange={(e) => setWalkInCheckOut(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Guests Count</label>
                  <input
                    type="number"
                    min={1}
                    value={walkInGuests}
                    onChange={(e) => setWalkInGuests(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Agreed Price ($)</label>
                  <input
                    type="number"
                    value={walkInPrice}
                    onChange={(e) => setWalkInPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Special Requests / Reception Notes</label>
                <input
                  type="text"
                  value={walkInRequests}
                  onChange={(e) => setWalkInRequests(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-navy-950 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm Walk-in & Lock Front-End Dates</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

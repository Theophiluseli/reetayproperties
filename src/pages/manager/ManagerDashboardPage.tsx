import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { Property, Booking, User, VerticalType } from '../../types';
import {
  Briefcase,
  Plus,
  Users,
  Building,
  DollarSign,
  UserCheck,
  CheckCircle,
  Clock,
  Lock,
  X,
  Sparkles,
  Phone,
  Mail,
  Edit2,
  Trash2,
  Eye,
  Car,
  Bed,
  Check,
  Tag,
  Fuel,
  Sliders,
  FileText,
  Upload
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface ManagerDashboardPageProps {
  managerUser: User | null;
}

export const ManagerDashboardPage: React.FC<ManagerDashboardPageProps> = ({ managerUser }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings'>('bookings');
  const [inventoryVerticalFilter, setInventoryVerticalFilter] = useState<'all' | VerticalType>('all');

  // Modals state
  const [showClientModal, setShowClientModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form State for Adding / Editing Property
  const [propTitle, setPropTitle] = useState('');
  const [propVertical, setPropVertical] = useState<VerticalType>('cars');
  const [propPrice, setPropPrice] = useState(95);
  const [propUnitLabel, setPropUnitLabel] = useState('Starting from');
  const [propArea, setPropArea] = useState('Airport Residential');
  const [propCity, setPropCity] = useState('Accra');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');
  const [propDescription, setPropDescription] = useState('');
  const [propBadge, setPropBadge] = useState('Summer Deals');

  // Vehicle specific state
  const [propFuelType, setPropFuelType] = useState<'Petrol' | 'Diesel' | 'Hybrid' | 'Electric'>('Petrol');
  const [propTransmission, setPropTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [propVehicleType, setPropVehicleType] = useState<'Sedan' | 'SUV' | 'Van' | 'Minibus' | 'Luxury' | 'Crossover'>('SUV');
  const [propPickupLocations, setPropPickupLocations] = useState('Accra, Kumasi, Sunyani, Takoradi');
  const [propDropoffLocations, setPropDropoffLocations] = useState('Cape Coast, Ho, Wa, Sunyani, Accra');

  // Stay specific state
  const [propMaxGuests, setPropMaxGuests] = useState(5);
  const [propBedrooms, setPropBedrooms] = useState(2);
  const [propBeds, setPropBeds] = useState(2);
  const [propBathrooms, setPropBathrooms] = useState(2);

  // Amenities selection
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Client reservation form
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [checkInDate, setCheckInDate] = useState('2026-09-18');
  const [checkOutDate, setCheckOutDate] = useState('2026-09-22');
  const [guestsCount, setGuestsCount] = useState(2);
  const [agreedPrice, setAgreedPrice] = useState(1200);
  const [specialNotes, setSpecialNotes] = useState('VIP reservation made by Operations Manager.');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const stays = await dataService.getProperties('stays');
    const cars = await dataService.getProperties('cars');
    const exps = await dataService.getProperties('experiences');
    const allProps = [...stays, ...cars, ...exps];
    const b = await dataService.getBookings();

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
    setPropDescription('Executive luxury rental vehicle with climate control, high comfort, and driver options.');
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
      description: propDescription || 'High-end luxury offering.',
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
      alert('New listing published successfully to front-end!');
    }

    setShowPropertyModal(false);
    loadData();
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to remove this listing?')) {
      await dataService.deleteProperty(id);
      loadData();
    }
  };

  const handleToggleStatus = async (id: string) => {
    await dataService.togglePropertyStatus(id);
    loadData();
  };

  const handleCreateManagerBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      await dataService.createWalkInBooking({
        propertyId: selectedPropertyId,
        guest_name: clientName,
        guest_email: clientEmail,
        guest_phone: clientPhone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guestsCount,
        totalPrice: agreedPrice,
        special_requests: specialNotes,
        booking_category: 'overnight',
        created_by_role: 'manager',
        created_by_name: managerUser?.full_name || 'Kofi Mensah (Manager)'
      });
      setShowClientModal(false);
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      loadData();
      alert('Reservation created! It is now synced to the Front Desk Receptionist dashboard for client arrival verification.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error making reservation');
    }
  };

  const filteredProperties = properties.filter(p => {
    if (inventoryVerticalFilter === 'all') return true;
    return p.vertical === inventoryVerticalFilter;
  });

  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
  const checkedInCount = bookings.filter(b => b.arrival_status === 'checked_in').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-black uppercase">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Operations Manager Console</span>
          </div>
          <h1 className="text-3xl font-black">Reetay Fleet & Property Operations</h1>
          <p className="text-xs text-gray-300">
            Logged in as {managerUser?.full_name || 'Kofi Mensah (Manager)'}. Manage stays, cars, experiences, revenue, and client bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3.5 rounded-full bg-white text-navy-950 font-black text-xs shadow-md hover:bg-gray-100 flex items-center justify-center gap-2 active:scale-95 transition-all border border-purple-200"
          >
            <Plus className="w-4 h-4 text-purple-700 stroke-[3]" />
            <span>Add New Listing</span>
          </button>

          <button
            onClick={() => setShowClientModal(true)}
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-xs shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Make Booking for Client</span>
          </button>
        </div>
      </div>

      {/* Operations Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue Settled</span>
          <div className="text-3xl font-black text-navy-950 mt-2">${totalRevenue}</div>
          <span className="text-[10px] text-emerald-600 font-bold">Online, Walk-in & Fleet Rentals</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">In-House Guests</span>
          <div className="text-3xl font-black text-emerald-600 mt-2">{checkedInCount}</div>
          <span className="text-[10px] text-gray-400 font-bold">Checked in by Receptionist</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">Total Active Fleet & Stays</span>
          <div className="text-3xl font-black text-navy-950 mt-2">{properties.length}</div>
          <span className="text-[10px] text-amber-600 font-bold">Stays, Cars & Experiences</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-gray-400 uppercase">System Status</span>
          <div className="text-3xl font-black text-emerald-600 mt-2 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            <span>Live</span>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">Front desk & public grid synced</span>
        </div>
      </div>

      {/* Console Section Navigation Tabs */}
      <div className="flex gap-3 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'bookings' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4 text-gold-400" />
          <span>Receptionist & Online Booking Feed ({bookings.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'listings' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950 hover:bg-gray-100'
          }`}
        >
          <Building className="w-4 h-4 text-gold-400" />
          <span>Listings & Fleet Inventory ({properties.length})</span>
        </button>
      </div>

      {/* Tab 1: Bookings Feed */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-navy-950">Live Reservations Log</h3>
              <p className="text-xs text-gray-500">Live operational log showing walk-ins, short-time stays, and client check-ins</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                <tr>
                  <th className="p-4">Ref & Type</th>
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Residence / Vehicle</th>
                  <th className="p-4">Dates / Hours</th>
                  <th className="p-4">Creator / Role</th>
                  <th className="p-4">Arrival Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <span className="font-mono font-black text-gold-600 block">{b.id}</span>
                      <span className="text-[9px] uppercase font-bold text-gray-400">
                        {b.booking_category === 'short_time' ? `Short-Time (${b.short_time_hours}h)` : 'Overnight'}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-extrabold text-navy-950">{b.guest_name}</p>
                      <p className="text-gray-400 text-[11px]">{b.guest_phone}</p>
                    </td>

                    <td className="p-4 font-extrabold">{b.property.title}</td>

                    <td className="p-4">
                      <span>{b.check_in} &rarr; {b.check_out}</span>
                      {b.check_in_time ? (
                        <span className="block text-[10px] text-purple-700 font-bold">⏰ {b.check_in_time} - {b.check_out_time} (Out)</span>
                      ) : (
                        <span className="block text-[10px] text-gray-400 font-bold">Check-Out: {b.check_out} 12:00 PM</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="text-navy-950 font-bold block">{b.created_by_name || 'Online Guest'}</span>
                      <span className="text-[9px] font-black uppercase text-gold-600">{b.created_by_role || 'guest'}</span>
                    </td>

                    <td className="p-4 flex flex-col gap-1 items-start">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        b.arrival_status === 'checked_in'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'completed'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.arrival_status === 'checked_in' ? 'Checked In' : b.status === 'completed' ? 'Checked Out' : 'Expected'}
                      </span>

                      {b.arrival_status === 'checked_in' && (
                        <button
                          onClick={async () => {
                            await dataService.checkOutGuest(b.id);
                            loadData();
                          }}
                          className="px-3 py-1 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] shadow-sm"
                        >
                          Check-Out Client
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Inventory Management (Listings CRUD) */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-navy-950">Property & Fleet Inventory Management</h3>
              <p className="text-xs text-gray-500">Create, edit, toggle availability status, or remove listings across Stays, Cars, and Experiences</p>
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
                  <th className="p-4">Listing / Fleet</th>
                  <th className="p-4">Vertical</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price & Label</th>
                  <th className="p-4">Specs / Features</th>
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

                    <td className="p-4">
                      <span className="font-black text-navy-950 text-sm">${p.price_per_night}</span>
                      <span className="block text-[10px] text-gray-400 font-normal">{p.price_unit_label || (p.vertical === 'cars' ? 'Starting from' : 'per night')}</span>
                    </td>

                    <td className="p-4">
                      {p.vertical === 'cars' ? (
                        <div className="space-y-0.5 text-[11px] text-gray-600">
                          <p>👥 {p.max_guests} Passengers</p>
                          <p>⚙️ {p.transmission || 'Automatic'} | ⛽ {p.fuel_type || 'Petrol'}</p>
                        </div>
                      ) : (
                        <div className="space-y-0.5 text-[11px] text-gray-600">
                          <p>👥 {p.max_guests} Guests | 🛏️ {p.bedrooms} Beds</p>
                          <p>🛁 {p.bathrooms} Baths</p>
                        </div>
                      )}
                    </td>

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
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'stays' ? 'bg-[#2E0854] text-white border-[#2E0854]' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Bed className="w-4 h-4" />
                    <span>Stays</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropVertical('cars')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'cars' ? 'bg-[#2E0854] text-white border-[#2E0854]' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Cars</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropVertical('experiences')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'experiences' ? 'bg-[#2E0854] text-white border-[#2E0854]' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Sparkles className="w-4 h-4" />
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
                className="w-full py-3.5 bg-[#2E0854] text-white font-black text-xs rounded-xl shadow-md hover:bg-purple-900 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-gold-400" />
                <span>{editingProperty ? 'Update Listing Details' : 'Publish Listing to Front-End'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manager Booking on Behalf of Client */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-gray-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-navy-950 text-base">Make Booking for Client</h3>
              </div>
              <button onClick={() => setShowClientModal(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-700 font-bold">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleCreateManagerBooking} className="space-y-3">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Select Residence or Vehicle</label>
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
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Client Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Senator James Smith"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Client Email</label>
                  <input
                    type="email"
                    placeholder="client@diplomat.org"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Client Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+233 24 111 2222"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
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
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Total Package Price ($)</label>
                <input
                  type="number"
                  value={agreedPrice}
                  onChange={(e) => setAgreedPrice(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-black text-gold-700 outline-none text-base"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-navy-950 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-2 hover:bg-navy-900 transition-all"
              >
                <Lock className="w-4 h-4 text-gold-400" />
                <span>Save Client Booking & Sync to Front Desk</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { dataService } from '../../lib/supabase';
import { useRealtimeSync } from '../../lib/realtimeSync';
import { Property, Booking, User, VerticalType } from '../../types';
import { IncomingReservationsDesk } from '../../components/dashboard/IncomingReservationsDesk';
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
import { Link, Navigate, useSearchParams } from 'react-router-dom';

interface ManagerDashboardPageProps {
  managerUser: User | null;
}

export const ManagerDashboardPage: React.FC<ManagerDashboardPageProps> = ({ managerUser }) => {
  if (!managerUser) {
    return <Navigate to="/portal/login" replace />;
  }
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || searchParams.get('view');

  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings'>(
    tabParam === 'listings' ? 'listings' : 'bookings'
  );

  useEffect(() => {
    if (tabParam === 'listings') setActiveTab('listings');
    else if (tabParam === 'bookings') setActiveTab('bookings');
  }, [tabParam]);
  const [selectedVertical, setSelectedVertical] = useState<VerticalType>('stays');
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
  const [propBadge, setPropBadge] = useState('');
  const [propStatus, setPropStatus] = useState<'published' | 'draft'>('published');
  const [propOperationalStatus, setPropOperationalStatus] = useState<'available' | 'occupied' | 'booked' | 'maintenance' | 'cleaning'>('available');

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

  useRealtimeSync(['properties', 'bookings', 'incident_reports', 'shift_handovers'], () => {
    loadData();
  });

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
    setPropVertical(selectedVertical);
    setPropPrice(selectedVertical === 'cars' ? 95 : selectedVertical === 'experiences' ? 150 : 250);
    setPropUnitLabel(selectedVertical === 'cars' ? 'Starting from' : selectedVertical === 'experiences' ? 'per person' : 'per night');
    setPropArea('Airport Residential');
    setPropCity('Accra');
    setCoverImage(
      selectedVertical === 'cars'
        ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80'
        : selectedVertical === 'experiences'
        ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
        : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
    );
    setGalleryImages(
      selectedVertical === 'cars'
        ? [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
          ]
        : selectedVertical === 'experiences'
        ? [
            'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
          ]
        : [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
          ]
    );
    setNewGalleryUrlInput('');
    setPropDescription(
      selectedVertical === 'cars'
        ? 'Executive luxury rental vehicle with climate control, high comfort, and driver options.'
        : selectedVertical === 'experiences'
        ? 'VIP local experience package with professional host and concierge tour guide.'
        : 'Luxury serviced residence with full amenities, 24/7 power backup, and pool access.'
    );
    setPropBadge('');
    setPropFuelType('Petrol');
    setPropTransmission('Automatic');
    setPropVehicleType('SUV');
    setPropPickupLocations('Accra, Kumasi, Sunyani, Takoradi');
    setPropDropoffLocations('Cape Coast, Ho, Wa, Sunyani, Accra');
    setPropMaxGuests(selectedVertical === 'cars' ? 5 : selectedVertical === 'experiences' ? 10 : 4);
    setPropBedrooms(selectedVertical === 'stays' ? 2 : 0);
    setPropBeds(selectedVertical === 'stays' ? 2 : 0);
    setPropBathrooms(selectedVertical === 'stays' ? 2 : 0);
    setSelectedAmenities(
      selectedVertical === 'cars'
        ? ['GPS', 'Air-condition', 'Bluetooth audio connectivity', 'Spacious seating & clean interiors']
        : selectedVertical === 'experiences'
        ? ['Private Tour Guide', 'Refreshments Included', 'VIP Shuttle Transport']
        : ['WiFi', 'Air-condition', 'Fully Equipped Kitchen', 'Swimming Pool', '24/7 Security']
    );
    setPropStatus('published');
    setPropOperationalStatus('available');
    setShowPropertyModal(true);
  };

  const handleSelectModalVertical = (v: VerticalType) => {
    setPropVertical(v);
    if (!editingProperty) {
      if (v === 'cars') {
        setCoverImage('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80');
        setGalleryImages([
          'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
        ]);
        setPropPrice(95);
        setPropUnitLabel('Starting from');
        setPropMaxGuests(5);
        setPropBedrooms(0);
        setPropBeds(0);
        setPropBathrooms(0);
      } else if (v === 'experiences') {
        setCoverImage('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80');
        setGalleryImages([
          'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
        ]);
        setPropPrice(150);
        setPropUnitLabel('per person');
        setPropMaxGuests(10);
        setPropBedrooms(0);
        setPropBeds(0);
        setPropBathrooms(0);
      } else {
        setCoverImage('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80');
        setGalleryImages([
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'
        ]);
        setPropPrice(250);
        setPropUnitLabel('per night');
        setPropMaxGuests(4);
        setPropBedrooms(2);
        setPropBeds(2);
        setPropBathrooms(2);
      }
    }
  };

  const handleOpenEditModal = (prop: Property) => {
    setEditingProperty(prop);
    setPropTitle(prop.title);
    setPropVertical(prop.vertical);
    setPropPrice(prop.price_per_night);
    setPropUnitLabel(prop.price_unit_label || (prop.vertical === 'cars' ? 'Starting from' : 'per night'));
    setPropArea(prop.location.area);
    setPropCity(prop.location.city);
    setCoverImage(
      prop.images[0] ||
      (prop.vertical === 'cars'
        ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80'
        : prop.vertical === 'experiences'
        ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
        : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80')
    );
    setGalleryImages(prop.images.slice(1) || []);
    setNewGalleryUrlInput('');
    setPropDescription(prop.description);
    setPropBadge(prop.badge || '');
    setPropStatus(prop.status || 'published');
    setPropOperationalStatus(prop.operational_status || 'available');
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
    const fallbackImage =
      propVertical === 'cars'
        ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80'
        : propVertical === 'experiences'
        ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
        : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80';
    const payload: Partial<Property> = {
      title: propTitle || (propVertical === 'cars' ? 'Executive Fleet Vehicle' : 'Luxury Residence'),
      description: propDescription || 'High-end luxury offering.',
      vertical: propVertical,
      price_per_night: Number(propPrice),
      price_unit_label: propUnitLabel,
      status: propStatus,
      operational_status: propOperationalStatus,
      location: {
        city: propCity,
        area: propArea,
        address: `${propArea}, ${propCity}`,
        lat: 5.6037,
        lng: -0.1870
      },
      max_guests: Number(propMaxGuests),
      bedrooms: propVertical === 'stays' ? Number(propBedrooms) : 0,
      beds: propVertical === 'stays' ? Number(propBeds) : 0,
      bathrooms: propVertical === 'stays' ? Number(propBathrooms) : 0,
      fuel_type: propVertical === 'cars' ? propFuelType : undefined,
      transmission: propVertical === 'cars' ? propTransmission : undefined,
      vehicle_type: propVertical === 'cars' ? propVehicleType : undefined,
      pickup_locations: propVertical === 'cars' ? propPickupLocations.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      dropoff_locations: propVertical === 'cars' ? propDropoffLocations.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      amenities: selectedAmenities,
      badge: propBadge,
      images: allImages.length > 0 ? allImages : [fallbackImage]
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

  const handleOperationalStatusChange = async (id: string, newOpStatus: 'available' | 'occupied' | 'booked' | 'maintenance' | 'cleaning') => {
    await dataService.updatePropertyStatus(id, { operational_status: newOpStatus });
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
        created_by_name: managerUser?.full_name || 'Philip (Manager)'
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
            Logged in as {managerUser?.full_name || 'Philip (Manager)'}. Manage stays, cars, experiences, revenue, and client bookings.
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

      {/* Management Portal Vertical Switcher Bar */}
      <div className="flex justify-center pt-2">
        <div className="bg-purple-50/70 p-1.5 rounded-full border border-purple-100/80 inline-flex items-center gap-1.5 shadow-sm">
          <button
            onClick={() => {
              setSelectedVertical('stays');
              setInventoryVerticalFilter('stays');
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              selectedVertical === 'stays'
                ? 'bg-[#2E0854] text-white shadow-lg scale-[1.02]'
                : 'text-purple-900 hover:bg-white/80'
            }`}
          >
            <Bed className="w-4 h-4 text-purple-300" />
            <span>Stays</span>
          </button>

          <button
            onClick={() => {
              setSelectedVertical('cars');
              setInventoryVerticalFilter('cars');
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              selectedVertical === 'cars'
                ? 'bg-[#2E0854] text-white shadow-lg scale-[1.02]'
                : 'text-purple-900 hover:bg-white/80'
            }`}
          >
            <Car className="w-4 h-4 text-purple-300" />
            <span>Cars</span>
          </button>

          <button
            onClick={() => {
              setSelectedVertical('experiences');
              setInventoryVerticalFilter('experiences');
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
              selectedVertical === 'experiences'
                ? 'bg-[#2E0854] text-white shadow-lg scale-[1.02]'
                : 'text-purple-900 hover:bg-white/80'
            }`}
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            <span>Experiences</span>
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
          <span className="text-xs font-bold text-gray-400 uppercase">
            Active {selectedVertical.toUpperCase()} Inventory
          </span>
          <div className="text-3xl font-black text-navy-950 mt-2">
            {properties.filter(p => p.vertical === selectedVertical || (!p.vertical && selectedVertical === 'stays')).length}
          </div>
          <span className="text-[10px] text-amber-600 font-bold">Filtered for {selectedVertical}</span>
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
          <span>
            {selectedVertical === 'cars' ? 'Fleet Rental & Dispatch Log' :
             selectedVertical === 'experiences' ? 'Tour & Concierge Log' :
             'Receptionist & Online Booking Feed'} ({bookings.filter(b => (b.property?.vertical || 'stays') === selectedVertical).length})
          </span>
        </button>
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-2 ${
            activeTab === 'listings' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950 hover:bg-gray-100'
          }`}
        >
          <Building className="w-4 h-4 text-gold-400" />
          <span>
            {selectedVertical.toUpperCase()} Inventory ({properties.filter(p => (p.vertical || 'stays') === selectedVertical).length})
          </span>
        </button>
      </div>

      {/* Tab 1: Bookings Feed */}
      {activeTab === 'bookings' && (
        <IncomingReservationsDesk
          bookings={bookings}
          properties={properties}
          onRefresh={loadData}
          currentUserRole="manager"
          currentUserName={managerUser?.full_name || 'Operations Manager'}
          selectedVertical={selectedVertical}
        />
      )}

      {/* Tab 2: Inventory Management (Listings CRUD) */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-navy-950">Property & Fleet Inventory Management</h3>
              <p className="text-xs text-gray-500">Create, edit, toggle availability status, or remove listings across Stays, Cars, and Experiences</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-navy-950 text-white rounded-full text-xs font-bold hover:bg-navy-900 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 text-gold-400 stroke-[3]" />
                <span>Add New {selectedVertical === 'cars' ? 'Vehicle' : selectedVertical === 'experiences' ? 'Experience' : 'Stay'} Package</span>
              </button>

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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                <tr>
                  <th className="p-4">Listing / Fleet</th>
                  <th className="p-4">Vertical</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price & Label</th>
                  <th className="p-4">Specs / Features</th>
                  <th className="p-4">Visibility</th>
                  <th className="p-4">Live Status</th>
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
                        title="Toggle Published / Draft"
                      >
                        {p.status || 'published'}
                      </button>
                    </td>

                    <td className="p-4">
                      <select
                        value={p.operational_status || 'available'}
                        onChange={(e) => handleOperationalStatusChange(p.id, e.target.value as any)}
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-xl border outline-none cursor-pointer transition-all ${
                          (p.operational_status || 'available') === 'available'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                            : p.operational_status === 'occupied'
                            ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100'
                            : p.operational_status === 'booked'
                            ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            : p.operational_status === 'maintenance'
                            ? 'bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100'
                            : 'bg-cyan-50 text-cyan-800 border-cyan-300 hover:bg-cyan-100'
                        }`}
                        title="Update Live Operational Status"
                      >
                        <option value="available">● Available</option>
                        <option value="occupied">● Occupied</option>
                        <option value="booked">● Booked</option>
                        <option value="maintenance">● Maintenance</option>
                        <option value="cleaning">● Cleaning</option>
                      </select>
                    </td>

                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#2E0854] transition-all inline-flex items-center gap-1.5 text-[11px] font-black shrink-0 border border-purple-100"
                          title="Edit Listing"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-purple-700" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(p.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-all inline-flex items-center gap-1.5 text-[11px] font-black shrink-0 border border-rose-100"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Delete</span>
                        </button>
                      </div>
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
                    onClick={() => handleSelectModalVertical('stays')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'stays' ? 'bg-[#2E0854] text-white border-[#2E0854]' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Bed className="w-4 h-4" />
                    <span>Stays</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectModalVertical('cars')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'cars' ? 'bg-[#2E0854] text-white border-[#2E0854]' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Car className="w-4 h-4" />
                    <span>Cars</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectModalVertical('experiences')}
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

              {/* Status & Badge Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Listing Visibility Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPropStatus('published')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        propStatus === 'published'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                      <span>Published</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPropStatus('draft')}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        propStatus === 'draft'
                          ? 'bg-navy-950 text-white border-navy-950 shadow-sm'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                      <span>Draft</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Promotional Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Featured, Luxury, Popular"
                    value={propBadge}
                    onChange={(e) => setPropBadge(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-navy-950 outline-none"
                  />
                </div>
              </div>

              {/* Operational Availability Status Selector */}
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Operational Availability Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => setPropOperationalStatus('available')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      propOperationalStatus === 'available'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>Available</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropOperationalStatus('occupied')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      propOperationalStatus === 'occupied'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                    <span>Occupied</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropOperationalStatus('booked')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      propOperationalStatus === 'booked'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Booked</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropOperationalStatus('maintenance')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      propOperationalStatus === 'maintenance'
                        ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span>Maintenance</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropOperationalStatus('cleaning')}
                    className={`py-2 px-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      propOperationalStatus === 'cleaning'
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>Cleaning</span>
                  </button>
                </div>
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

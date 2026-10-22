import React, { useEffect, useState } from 'react';
import { dataService, DEFAULT_RECEPTIONIST_PERMISSIONS, DEFAULT_MANAGER_PERMISSIONS, DEFAULT_ADMIN_PERMISSIONS } from '../../lib/supabase';
import { useRealtimeSync } from '../../lib/realtimeSync';
import { cloudSync } from '../../lib/cloudSync';
import { Property, Booking, User, VerticalType, StaffAccount, IncidentReport, StaffPermissions, DatabaseHealthInfo } from '../../types';
import { IncomingReservationsDesk } from '../../components/dashboard/IncomingReservationsDesk';
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
  Upload,
  UserPlus,
  UserX,
  Key,
  Clock,
  LogOut,
  Download,
  TrendingUp,
  Search,
  AlertTriangle,
  FileWarning,
  Briefcase,
  Copy,
  Eye,
  EyeOff,
  Settings,
  Database,
  RefreshCw,
  Sliders,
  ShieldAlert,
  Server,
  HardDrive,
  Shield
} from 'lucide-react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';

interface AdminDashboardPageProps {
  adminUser: User | null;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ adminUser }) => {
  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || searchParams.get('view');

  const [properties, setProperties] = useState<Property[]>(() => dataService.getLocalProperties());
  const [bookings, setBookings] = useState<Booking[]>(() => dataService.getLocalBookings());
  const [activeTab, setActiveTab] = useState<'bookings' | 'listings' | 'staff' | 'clients' | 'financials' | 'incidents'>(
    (tabParam === 'settings' ? 'staff' : tabParam as any) || 'bookings'
  );

  useEffect(() => {
    if (tabParam) {
      if (tabParam === 'settings') {
        setActiveTab('staff');
      } else if (['bookings', 'listings', 'staff', 'clients', 'financials', 'incidents'].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, [tabParam]);
  const [selectedVertical, setSelectedVertical] = useState<VerticalType>('stays');
  const [inventoryVerticalFilter, setInventoryVerticalFilter] = useState<'all' | VerticalType>('all');
  
  // Client Directory & Revenue Accounting State
  const [clientSearchQuery, setClientSearchQuery] = useState('');
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>('');
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  
  // Staff Management State
  const [staffAccounts, setStaffAccounts] = useState<StaffAccount[]>([]);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);
  const [staffFullName, setStaffFullName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('staff123');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffRole, setStaffRole] = useState<'receptionist' | 'manager' | 'admin'>('receptionist');
  const [staffNotification, setStaffNotification] = useState('');
  const [staffErrorMsg, setStaffErrorMsg] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState<'all' | 'receptionist' | 'manager' | 'admin'>('all');
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [showStaffPassword, setShowStaffPassword] = useState(false);
  const [copiedStaffId, setCopiedStaffId] = useState<string | null>(null);
  const [createdStaffSummary, setCreatedStaffSummary] = useState<{
    name: string;
    email: string;
    role: string;
    pass: string;
  } | null>(null);

  // Admin Settings & DB Center State
  const [dbHealth, setDbHealth] = useState<DatabaseHealthInfo | null>(null);
  const [isRefreshingDb, setIsRefreshingDb] = useState(false);
  const [passwordResetTarget, setPasswordResetTarget] = useState<StaffAccount | null>(null);
  const [resetPasswordValue, setResetPasswordValue] = useState('');
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [showResetPasswordPlain, setShowResetPasswordPlain] = useState(false);
  const [permissionsEditTarget, setPermissionsEditTarget] = useState<StaffAccount | null>(null);
  const [editablePermissions, setEditablePermissions] = useState<StaffPermissions>(DEFAULT_RECEPTIONIST_PERMISSIONS);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [dbExportMessage, setDbExportMessage] = useState('');

  // Feature Access Configuration State
  const [staffPermWalkin, setStaffPermWalkin] = useState(true);
  const [staffPermCheckout, setStaffPermCheckout] = useState(true);
  const [staffPermStatus, setStaffPermStatus] = useState(true);
  const [staffPermFinancials, setStaffPermFinancials] = useState(true);
  const [staffPermMessages, setStaffPermMessages] = useState(true);

  // Modals state
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [isSavingProperty, setIsSavingProperty] = useState(false);

  // Listing Form State
  const [propTitle, setPropTitle] = useState('');
  const [propArea, setPropArea] = useState('Airport Residential');
  const [propCity, setPropCity] = useState('Accra');
  const [propPrice, setPropPrice] = useState(300);
  const [propUnitLabel, setPropUnitLabel] = useState('Starting from');
  const [propVertical, setPropVertical] = useState<VerticalType>('stays');
  const [propBadge, setPropBadge] = useState('');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState('');
  const [propDescription, setPropDescription] = useState('');
  const [propStatus, setPropStatus] = useState<'published' | 'draft'>('published');
  const [propOperationalStatus, setPropOperationalStatus] = useState<'available' | 'occupied' | 'booked' | 'maintenance' | 'cleaning'>('available');

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

  useRealtimeSync(['properties', 'bookings', 'users', 'incident_reports', 'shift_handovers'], () => {
    loadAdminData();
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // 1. Instant sync from local in-memory cache (0ms)
      const localProps = dataService.getLocalProperties();
      if (localProps.length > 0) {
        setProperties(localProps);
      }
      const localB = dataService.getLocalBookings();
      if (localB.length > 0) {
        setBookings(localB);
      }

      // 2. Fetch all datasets concurrently without blocking each other
      const [allProps, b, st, inc, health] = await Promise.all([
        dataService.getProperties('all', undefined, undefined, true),
        dataService.getBookings(),
        dataService.getStaffAccounts(),
        dataService.getIncidentReports(),
        dataService.getDatabaseHealth()
      ]);
      setProperties(allProps);
      setBookings(b);
      setStaffAccounts(st);
      setIncidentReports(inc);
      setDbHealth(health);
      if (allProps.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(allProps[0].id);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleRefreshDbHealth = async () => {
    setIsRefreshingDb(true);
    const health = await dataService.getDatabaseHealth();
    setDbHealth(health);
    setIsRefreshingDb(false);
    setStaffNotification('Database connection health verified.');
    setTimeout(() => setStaffNotification(''), 3000);
  };

  const handleSyncFromPeers = () => {
    cloudSync.requestPeerSync();
    setStaffNotification('Sync request sent across global network! Pulling listings from any active admin device...');
    setTimeout(() => loadAdminData(), 1200);
    setTimeout(() => setStaffNotification(''), 4500);
  };

  const handleOpenResetPassword = (staff: StaffAccount) => {
    setPasswordResetTarget(staff);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const generated = staff.role === 'manager' ? `Mgr#${randomSuffix}` : `Staff#${randomSuffix}`;
    setResetPasswordValue(generated);
    setShowResetPasswordPlain(true);
    setShowResetPasswordModal(true);
  };

  const handleConfirmResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordResetTarget || !resetPasswordValue.trim()) return;
    try {
      await dataService.resetStaffPassword(passwordResetTarget.id, resetPasswordValue.trim());
      setStaffNotification(`Successfully updated password for ${passwordResetTarget.full_name}!`);
      setCreatedStaffSummary({
        name: passwordResetTarget.full_name,
        email: passwordResetTarget.email,
        role: passwordResetTarget.role,
        pass: resetPasswordValue.trim()
      });
      setShowResetPasswordModal(false);
      loadAdminData();
      setTimeout(() => setStaffNotification(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    }
  };

  const handleOpenEditPermissions = (staff: StaffAccount) => {
    setPermissionsEditTarget(staff);
    const defaultPerms = staff.role === 'manager'
      ? DEFAULT_MANAGER_PERMISSIONS
      : staff.role === 'admin'
        ? DEFAULT_ADMIN_PERMISSIONS
        : DEFAULT_RECEPTIONIST_PERMISSIONS;
    setEditablePermissions(staff.permissions ? { ...defaultPerms, ...staff.permissions } : { ...defaultPerms });
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!permissionsEditTarget) return;
    try {
      await dataService.updateStaffPermissions(permissionsEditTarget.id, editablePermissions);
      setStaffNotification(`Updated access control permissions for ${permissionsEditTarget.full_name}!`);
      setShowPermissionsModal(false);
      loadAdminData();
      setTimeout(() => setStaffNotification(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update permissions');
    }
  };

  const handleToggleStaffStatus = async (staff: StaffAccount) => {
    try {
      const updated = await dataService.toggleStaffStatus(staff.id);
      setStaffNotification(`Account for ${staff.full_name} is now ${updated.status.toUpperCase()}.`);
      loadAdminData();
      setTimeout(() => setStaffNotification(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to update account status');
    }
  };

  const handleExportDatabaseBackup = () => {
    const backupData = {
      system: 'Reetay Apartments Management System',
      environment: 'Production RBAC Data Store',
      exported_at: new Date().toISOString(),
      database_engine: 'PostgreSQL 15 via Supabase + Local Hybrid Storage',
      staff_accounts_count: staffAccounts.length,
      staff_accounts: staffAccounts,
      bookings_count: bookings.length,
      bookings: bookings,
      properties_count: properties.length,
      properties: properties,
      incident_reports_count: incidentReports.length,
      incident_reports: incidentReports
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reetay_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDbExportMessage('Full database snapshot exported successfully as JSON backup.');
    setTimeout(() => setDbExportMessage(''), 5000);
  };

  const handleResolveIncidentReport = async (reportId: string) => {
    await dataService.resolveIncidentReport(reportId);
    setStaffNotification(`Incident report ${reportId} marked as resolved & settled!`);
    loadAdminData();
    setTimeout(() => setStaffNotification(''), 4000);
  };

  const handleCheckInGuest = async (bookingId: string) => {
    await dataService.checkInGuest(bookingId);
    setStaffNotification(`Guest check-in recorded successfully for booking ${bookingId}!`);
    loadAdminData();
    setTimeout(() => setStaffNotification(''), 4000);
  };

  const handleCheckOutGuest = async (bookingId: string) => {
    await dataService.checkOutGuest(bookingId);
    setStaffNotification(`Guest check-out completed for booking ${bookingId}.`);
    loadAdminData();
    setTimeout(() => setStaffNotification(''), 4000);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (window.confirm(`Are you sure you want to cancel and delete booking ${bookingId}?`)) {
      await dataService.deleteBooking(bookingId);
      setStaffNotification(`Booking ${bookingId} removed.`);
      loadAdminData();
      setTimeout(() => setStaffNotification(''), 4000);
    }
  };

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const generated = `Staff#${code}`;
    setStaffPassword(generated);
  };

  const handleCopyCredentials = (staff: StaffAccount) => {
    const text = `Reetay Apartments Staff Credentials:
Portal URL: ${window.location.origin}/admin/login
Role: ${staff.role.toUpperCase()}
Name: ${staff.full_name}
Email: ${staff.email}
Password: ${staff.password || 'staff123'}`;
    navigator.clipboard.writeText(text);
    setCopiedStaffId(staff.id);
    setStaffNotification(`Copied login credentials for ${staff.full_name} to clipboard!`);
    setTimeout(() => {
      setCopiedStaffId(null);
      setStaffNotification('');
    }, 4000);
  };

  const handleOpenAddStaffModal = () => {
    setEditingStaff(null);
    setStaffFullName('');
    setStaffEmail('');
    setStaffPassword('staff123');
    setStaffPhone('');
    setStaffRole('receptionist');
    setStaffErrorMsg('');
    setShowStaffPassword(false);
    setStaffPermWalkin(true);
    setStaffPermCheckout(true);
    setStaffPermStatus(true);
    setStaffPermFinancials(true);
    setStaffPermMessages(true);
    setShowStaffModal(true);
  };

  const handleOpenEditStaffModal = (staff: StaffAccount) => {
    setEditingStaff(staff);
    setStaffFullName(staff.full_name);
    setStaffEmail(staff.email);
    setStaffPassword(staff.password || 'staff123');
    setStaffPhone(staff.phone || '');
    setStaffRole(staff.role);
    setStaffErrorMsg('');
    setShowStaffPassword(false);
    const p = staff.permissions || {
      can_register_walkins: true,
      can_checkout_guests: true,
      can_edit_booking_status: true,
      can_view_financials: true,
      can_send_messages: true,
      can_delete_bookings: staff.role !== 'receptionist'
    };
    setStaffPermWalkin(p.can_register_walkins);
    setStaffPermCheckout(p.can_checkout_guests);
    setStaffPermStatus(p.can_edit_booking_status);
    setStaffPermFinancials(p.can_view_financials);
    setStaffPermMessages(p.can_send_messages);
    setShowStaffModal(true);
  };

  const handleSaveStaffAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffErrorMsg('');
    const basePerms = staffRole === 'manager' 
      ? DEFAULT_MANAGER_PERMISSIONS 
      : staffRole === 'admin'
        ? DEFAULT_ADMIN_PERMISSIONS
        : DEFAULT_RECEPTIONIST_PERMISSIONS;

    const permissions: StaffPermissions = {
      ...basePerms,
      can_register_walkins: staffPermWalkin,
      can_checkout_guests: staffPermCheckout,
      can_edit_booking_status: staffPermStatus,
      can_view_financials: staffPermFinancials,
      can_send_messages: staffPermMessages,
      can_delete_bookings: staffRole === 'receptionist' ? false : true
    };

    try {
      if (editingStaff) {
        await dataService.updateStaffAccount(editingStaff.id, {
          full_name: staffFullName,
          phone: staffPhone,
          role: staffRole,
          password: staffPassword,
          permissions
        });
        setStaffNotification(`Updated staff account and permissions for ${staffFullName}.`);
      } else {
        await dataService.createStaffAccount({
          full_name: staffFullName,
          email: staffEmail,
          password: staffPassword,
          role: staffRole,
          phone: staffPhone,
          permissions
        });
        setCreatedStaffSummary({
          name: staffFullName,
          email: staffEmail,
          role: staffRole,
          pass: staffPassword
        });
        setActiveTab('staff');
        setStaffNotification(`Successfully registered ${staffRole.toUpperCase()} account for ${staffFullName}!`);
      }
      setShowStaffModal(false);
      loadAdminData();
      setTimeout(() => setStaffNotification(''), 4000);
    } catch (err: any) {
      setStaffErrorMsg(err.message || 'Failed to save staff account.');
    }
  };

  const handleDeleteStaffAccount = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove staff account for ${name}?`)) {
      await dataService.deleteStaffAccount(id);
      setStaffNotification(`Staff account for ${name} removed.`);
      loadAdminData();
      setTimeout(() => setStaffNotification(''), 4000);
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
            'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
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
        ? 'Executive rental listing managed by platform administration.'
        : selectedVertical === 'experiences'
        ? 'VIP local experience package with professional tour guide.'
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
    if (isSavingProperty) return;
    setIsSavingProperty(true);
    try {
      const allImages = [coverImage, ...galleryImages].filter(Boolean);
      const fallbackImage =
        propVertical === 'cars'
          ? 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80'
          : propVertical === 'experiences'
          ? 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80'
          : 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80';
      const payload: Partial<Property> = {
        title: propTitle || (propVertical === 'cars' ? 'Executive Fleet Vehicle' : 'Luxury Residence'),
        description: propDescription || 'Luxury platform listing.',
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
        setStaffNotification(`Listing "${payload.title}" updated successfully!`);
      } else {
        await dataService.createProperty(payload);
        setStaffNotification(`New listing "${payload.title}" published & saved to platform!`);
      }

      // Immediately focus inventory table and switch vertical so the new listing is highlighted
      setActiveTab('listings');
      if (payload.vertical) {
        setSelectedVertical(payload.vertical as VerticalType);
        setInventoryVerticalFilter(payload.vertical as VerticalType);
      }

      // Instant 0ms synchronous local UI update
      setProperties(dataService.getLocalProperties());

      setShowPropertyModal(false);
      loadAdminData();
      setTimeout(() => setStaffNotification(''), 4500);
    } catch (err: any) {
      alert(err.message || 'Failed to save listing');
    } finally {
      setIsSavingProperty(false);
    }
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
      setBookings(dataService.getLocalBookings());
      setProperties(dataService.getLocalProperties());
      setStaffNotification('Walk-in booking registered! Dates are now locked on the front-end calendar.');
      setTimeout(() => setStaffNotification(''), 4000);
      loadAdminData();
    } catch (err: any) {
      setWalkInError(err.message || 'Error recording walk-in booking');
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: 'upcoming' | 'active' | 'completed' | 'cancelled') => {
    await dataService.updateBookingStatus(bookingId, newStatus);
    setBookings(dataService.getLocalBookings());
    loadAdminData();
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm('Are you sure you want to permanently remove this property listing?')) {
      await dataService.deleteProperty(id);
      setProperties(dataService.getLocalProperties());
      setStaffNotification('Listing deleted and permanently removed from platform.');
      setTimeout(() => setStaffNotification(''), 3500);
      loadAdminData();
    }
  };

  const handleToggleStatus = async (id: string) => {
    const updated = await dataService.togglePropertyStatus(id);
    setProperties(dataService.getLocalProperties());
    if (updated) {
      setStaffNotification(`Listing status updated: ${updated.status === 'published' ? 'PUBLISHED (Live)' : 'DRAFT (Hidden)'}`);
      setTimeout(() => setStaffNotification(''), 3500);
    }
    loadAdminData();
  };

  const handleOperationalStatusChange = async (id: string, newOpStatus: 'available' | 'occupied' | 'booked' | 'maintenance' | 'cleaning') => {
    const updated = await dataService.updatePropertyStatus(id, { operational_status: newOpStatus });
    setProperties(dataService.getLocalProperties());
    if (updated) {
      setStaffNotification(`Operational status changed to ${newOpStatus.toUpperCase()}`);
      setTimeout(() => setStaffNotification(''), 3500);
    }
    loadAdminData();
  };

  const filteredProperties = properties.filter(p => {
    if (inventoryVerticalFilter === 'all') return true;
    return p.vertical === inventoryVerticalFilter;
  });

  // -------------------------------------------------------------
  // CLIENT DIRECTORY AGGREGATION & EXCEL EXPORT
  // -------------------------------------------------------------
  interface ClientRecord {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalBookings: number;
    totalSpend: number;
    lastBookingDate: string;
    categories: string[];
  }

  const clientsMap: { [key: string]: ClientRecord } = {};

  bookings.forEach(b => {
    const rawKey = (b.guest_email || b.guest_phone || b.guest_name || 'guest').toLowerCase().trim();
    if (!clientsMap[rawKey]) {
      clientsMap[rawKey] = {
        id: rawKey,
        name: b.guest_name || 'Guest Client',
        email: b.guest_email || 'N/A',
        phone: b.guest_phone || 'N/A',
        totalBookings: 0,
        totalSpend: 0,
        lastBookingDate: b.check_in || b.created_at || '2026-08-01',
        categories: []
      };
    }
    clientsMap[rawKey].totalBookings += 1;
    if (b.payment_status === 'paid' || b.status === 'completed' || b.status === 'active' || b.status === 'upcoming') {
      clientsMap[rawKey].totalSpend += b.total_price;
    }
    const catLabel = b.booking_category === 'short_time' ? 'Short-Time' : b.booking_type === 'walk_in' ? 'Walk-In' : 'Online';
    if (!clientsMap[rawKey].categories.includes(catLabel)) {
      clientsMap[rawKey].categories.push(catLabel);
    }
    if (b.check_in > clientsMap[rawKey].lastBookingDate) {
      clientsMap[rawKey].lastBookingDate = b.check_in;
    }
  });

  const allClientsList = Object.values(clientsMap);
  const filteredClientsList = allClientsList.filter(c => 
    c.name.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(clientSearchQuery.toLowerCase()) ||
    c.phone.toLowerCase().includes(clientSearchQuery.toLowerCase())
  );

  const handleExportClientsExcel = () => {
    if (allClientsList.length === 0) {
      alert('No client records found in database to export.');
      return;
    }

    const headers = ['Client Name', 'Email Address', 'Phone Number', 'Total Reservations', 'Total Paid Spend ($)', 'Last Booking Date'];
    const csvRows = [headers.join(',')];

    allClientsList.forEach(c => {
      const row = [
        `"${c.name.replace(/"/g, '""')}"`,
        `"${c.email.replace(/"/g, '""')}"`,
        `"${c.phone.replace(/"/g, '""')}"`,
        c.totalBookings,
        c.totalSpend,
        `"${c.lastBookingDate}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reetay_Client_Directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------------------------------------
  // REVENUE ACCOUNTING & MONTHLY ROLLOVER SYSTEM
  // -------------------------------------------------------------
  const paidBookings = bookings.filter(b => (b.payment_status === 'paid' || b.status === 'completed' || b.status === 'active') && b.status !== 'cancelled');
  const totalPaidRevenue = paidBookings.reduce((sum, b) => sum + b.total_price, 0);

  interface MonthlyAccount {
    monthKey: string;
    monthLabel: string;
    totalRevenue: number;
    bookingsCount: number;
    shortTimeRevenue: number;
    overnightRevenue: number;
    bookingsList: Booking[];
  }

  const monthlyRevenueMap: { [monthKey: string]: MonthlyAccount } = {};

  paidBookings.forEach(b => {
    const dateStr = b.check_in || b.created_at || '2026-08-01';
    const mKey = dateStr.slice(0, 7);
    
    if (!monthlyRevenueMap[mKey]) {
      const [y, m] = mKey.split('-');
      const d = new Date(parseInt(y), parseInt(m) - 1, 1);
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      monthlyRevenueMap[mKey] = {
        monthKey: mKey,
        monthLabel: label,
        totalRevenue: 0,
        bookingsCount: 0,
        shortTimeRevenue: 0,
        overnightRevenue: 0,
        bookingsList: []
      };
    }

    monthlyRevenueMap[mKey].totalRevenue += b.total_price;
    monthlyRevenueMap[mKey].bookingsCount += 1;
    monthlyRevenueMap[mKey].bookingsList.push(b);
    if (b.booking_category === 'short_time') {
      monthlyRevenueMap[mKey].shortTimeRevenue += b.total_price;
    } else {
      monthlyRevenueMap[mKey].overnightRevenue += b.total_price;
    }
  });

  const availableMonths = Object.keys(monthlyRevenueMap).sort().reverse();
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const activeMonthKey = selectedMonthKey || (availableMonths.includes(currentMonthStr) ? currentMonthStr : availableMonths[0] || currentMonthStr);

  const activeMonthData: MonthlyAccount = monthlyRevenueMap[activeMonthKey] || {
    monthKey: activeMonthKey,
    monthLabel: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    totalRevenue: 0,
    bookingsCount: 0,
    shortTimeRevenue: 0,
    overnightRevenue: 0,
    bookingsList: []
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      
      {/* Header */}
      <div className="bg-navy-950 text-white rounded-3xl p-5 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-extrabold uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Platform Admin Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">Reetay Executive Operations</h1>
          <p className="text-xs text-gray-300">Logged in as {adminUser?.full_name || 'Platform Administrator'}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <button
            onClick={handleOpenAddStaffModal}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-purple-500/50"
          >
            <UserPlus className="w-4 h-4 text-amber-300" />
            <span>Register Staff Account</span>
          </button>
          <button
            onClick={() => setShowWalkInModal(true)}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>Record Walk-in Booking</span>
          </button>
          <button
            onClick={handleSyncFromPeers}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer border border-blue-500/50"
            title="Request listings from other admin devices connected anywhere"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync from Other Admins</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-gold-400 via-amber-500 to-gold-500 text-navy-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
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
          <div className="text-3xl font-black text-navy-950 mt-2">${totalPaidRevenue}</div>
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

      {/* Notification Toast Banner */}
      {staffNotification && (
        <div className="bg-emerald-500 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-white" />
            <span>{staffNotification}</span>
          </div>
          <button onClick={() => setStaffNotification('')} className="text-white hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Management Portal Vertical Switcher Bar */}
      <div className="flex justify-center pt-2 overflow-x-auto max-w-full">
        <div className="bg-purple-50/70 p-1.5 rounded-full border border-purple-100/80 inline-flex items-center gap-1.5 shadow-sm whitespace-nowrap">
          <button
            onClick={() => {
              setSelectedVertical('stays');
              setInventoryVerticalFilter('stays');
            }}
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
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
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
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
            className={`px-5 sm:px-6 py-2.5 rounded-full text-xs font-black transition-all flex items-center gap-2 ${
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

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 border-b border-gray-200 pb-2.5 scrollbar-none">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shrink-0 ${
            activeTab === 'bookings' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950'
          }`}
        >
          {selectedVertical === 'cars' ? 'Fleet Rental & Dispatch Log' :
           selectedVertical === 'experiences' ? 'Tour & Concierge Reservations' :
           'Guest Bookings & Check-In'} ({bookings.filter(b => (b.property?.vertical || 'stays') === selectedVertical).length})
        </button>

        <button
          onClick={() => setActiveTab('clients')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'clients' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Client Directory ({allClientsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('financials')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'financials' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
          <span>Revenue & Monthly Rollover</span>
        </button>

        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'incidents' ? 'bg-rose-900 text-white shadow-md' : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
          <span>Damaged / Missing Items ({incidentReports.filter(r => r.status === 'pending_review').length})</span>
        </button>

        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center gap-1.5 shrink-0 ${
            activeTab === 'staff' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff & Access Control ({staffAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shrink-0 ${
            activeTab === 'listings' ? 'bg-navy-950 text-white shadow-md' : 'text-gray-500 hover:text-navy-950'
          }`}
        >
          {selectedVertical.toUpperCase()} Inventory ({properties.filter(p => (p.vertical || 'stays') === selectedVertical).length})
        </button>
      </div>

      {/* Tab 1: Bookings & Customer Follow-up Table */}
      {activeTab === 'bookings' && (
        <IncomingReservationsDesk
          bookings={bookings}
          properties={properties}
          onRefresh={loadAdminData}
          currentUserRole="admin"
          currentUserName={adminUser?.full_name || 'Platform Administrator'}
          selectedVertical={selectedVertical}
        />
      )}

      {/* Tab 2: Listings Table */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-4">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-navy-950">Platform Listings & Fleet Inventory</h3>
              <p className="text-xs text-gray-500 font-medium">Full CRUD control across Stays, Cars, and Experiences</p>
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
                  <th className="p-4">Property / Fleet</th>
                  <th className="p-4">Vertical</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Price & Label</th>
                  <th className="p-4">Rating</th>
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

      {/* Tab 3: Staff Accounts & Personnel Management */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden space-y-5 p-5 sm:p-6">
          
          {/* Newly Created Staff Account Credentials Alert Banner */}
          {createdStaffSummary && (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Account Registered Successfully</span>
                </div>
                <h4 className="text-sm font-black text-emerald-950">
                  {createdStaffSummary.name} is now registered as {createdStaffSummary.role.toUpperCase()}
                </h4>
                <p className="text-xs font-mono text-emerald-900">
                  Email: <span className="font-bold">{createdStaffSummary.email}</span> | Password: <span className="font-bold">{createdStaffSummary.pass}</span>
                </p>
                <p className="text-[11px] text-emerald-700">
                  Staff member can log in directly at <span className="font-bold underline">{window.location.origin}/admin/login</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    const text = `Reetay Apartments Staff Account:\nPortal URL: ${window.location.origin}/admin/login\nRole: ${createdStaffSummary.role.toUpperCase()}\nEmail: ${createdStaffSummary.email}\nPassword: ${createdStaffSummary.pass}`;
                    navigator.clipboard.writeText(text);
                    setStaffNotification(`Copied credentials for ${createdStaffSummary.name}!`);
                    setTimeout(() => setStaffNotification(''), 3000);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Credentials</span>
                </button>
                <button
                  onClick={() => setCreatedStaffSummary(null)}
                  className="p-1.5 rounded-xl hover:bg-emerald-200 text-emerald-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Header & Quick Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-[#2E0854] text-xs font-black uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Personnel & Access Control</span>
              </div>
              <h3 className="text-xl font-black text-navy-950">Staff Accounts & Access Control</h3>
              <p className="text-xs text-gray-500 font-medium">
                Register staff accounts, create and reset passwords, configure granular access control (RBAC), and manage operations personnel.
              </p>
            </div>
            
            <button
              onClick={handleOpenAddStaffModal}
              className="px-5 py-2.5 bg-gradient-to-r from-purple-700 to-[#2E0854] hover:brightness-110 text-white rounded-full text-xs font-black flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-amber-300" />
              <span>Register New Staff Account</span>
            </button>
          </div>

          {/* Role Summary Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 border border-gray-200/80 rounded-2xl p-3.5">
              <span className="text-[10px] font-extrabold uppercase text-gray-400 block">Total Staff</span>
              <span className="text-2xl font-black text-navy-950 mt-1 block">{staffAccounts.length}</span>
              <span className="text-[10px] text-gray-500 font-semibold">Active accounts</span>
            </div>

            <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3.5">
              <span className="text-[10px] font-extrabold uppercase text-amber-800 block">Managers</span>
              <span className="text-2xl font-black text-amber-950 mt-1 block">
                {staffAccounts.filter(s => s.role === 'manager').length}
              </span>
              <span className="text-[10px] text-amber-700 font-semibold">Console oversight</span>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-2xl p-3.5">
              <span className="text-[10px] font-extrabold uppercase text-emerald-800 block">Receptionists</span>
              <span className="text-2xl font-black text-emerald-950 mt-1 block">
                {staffAccounts.filter(s => s.role === 'receptionist').length}
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold">Front desk operations</span>
            </div>

            <div className="bg-purple-50/60 border border-purple-200/60 rounded-2xl p-3.5">
              <span className="text-[10px] font-extrabold uppercase text-purple-800 block">System Admins</span>
              <span className="text-2xl font-black text-[#2E0854] mt-1 block">
                {staffAccounts.filter(s => s.role === 'admin').length}
              </span>
              <span className="text-[10px] text-purple-700 font-semibold">Full access</span>
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            {/* Role Filter Tabs */}
            <div className="flex items-center bg-gray-100 p-1 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setStaffRoleFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  staffRoleFilter === 'all' ? 'bg-white text-navy-950 shadow-sm' : 'text-gray-500 hover:text-navy-950'
                }`}
              >
                All Staff ({staffAccounts.length})
              </button>
              <button
                type="button"
                onClick={() => setStaffRoleFilter('manager')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  staffRoleFilter === 'manager' ? 'bg-amber-100 text-amber-900 shadow-sm' : 'text-gray-500 hover:text-navy-950'
                }`}
              >
                Managers ({staffAccounts.filter(s => s.role === 'manager').length})
              </button>
              <button
                type="button"
                onClick={() => setStaffRoleFilter('receptionist')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  staffRoleFilter === 'receptionist' ? 'bg-emerald-100 text-emerald-900 shadow-sm' : 'text-gray-500 hover:text-navy-950'
                }`}
              >
                Receptionists ({staffAccounts.filter(s => s.role === 'receptionist').length})
              </button>
              <button
                type="button"
                onClick={() => setStaffRoleFilter('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                  staffRoleFilter === 'admin' ? 'bg-purple-100 text-[#2E0854] shadow-sm' : 'text-gray-500 hover:text-navy-950'
                }`}
              >
                Admins ({staffAccounts.filter(s => s.role === 'admin').length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative max-w-xs w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name or email..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs font-semibold text-navy-950 outline-none focus:bg-white focus:border-purple-600 transition-all"
              />
            </div>
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto border border-gray-100 rounded-2xl">
            <table className="w-full text-left text-xs min-w-[750px]">
              <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                <tr>
                  <th className="p-4">Staff Member</th>
                  <th className="p-4">Email & Contact</th>
                  <th className="p-4">Assigned Role</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4">Access Permissions (RBAC)</th>
                  <th className="p-4 text-right">Security & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
                {staffAccounts
                  .filter((s) => {
                    if (staffRoleFilter !== 'all' && s.role !== staffRoleFilter) return false;
                    if (staffSearchQuery.trim()) {
                      const q = staffSearchQuery.toLowerCase();
                      return s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
                    }
                    return true;
                  })
                  .map((s) => (
                    <tr key={s.id} className="hover:bg-purple-50/30 transition-colors">
                      {/* Staff Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={s.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={s.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-purple-200 shadow-sm flex-shrink-0"
                          />
                          <div>
                            <p className="font-black text-navy-950 text-xs">{s.full_name}</p>
                            <span className="text-[10px] text-gray-400 font-mono">Registered: {s.created_at}</span>
                          </div>
                        </div>
                      </td>

                      {/* Email & Contact */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-navy-950 text-xs">{s.email}</span>
                          <button
                            onClick={() => handleCopyCredentials(s)}
                            className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-navy-950 transition-colors"
                            title="Copy credentials"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="font-mono text-gray-500 text-[10px]">{s.phone || 'No phone'}</p>
                        {copiedStaffId === s.id && (
                          <span className="text-[10px] text-emerald-600 font-bold">✓ Copied to clipboard!</span>
                        )}
                      </td>

                      {/* Role */}
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1.5 ${
                          s.role === 'admin' ? 'bg-[#2E0854] text-white shadow-sm' :
                          s.role === 'manager' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                        }`}>
                          {s.role === 'admin' && <ShieldCheck className="w-3 h-3 text-gold-400" />}
                          {s.role === 'manager' && <Briefcase className="w-3 h-3 text-amber-600" />}
                          {s.role === 'receptionist' && <UserCheck className="w-3 h-3 text-emerald-600" />}
                          <span>{s.role}</span>
                        </span>
                      </td>

                      {/* Status & Suspend Toggle */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border inline-block ${
                            s.status === 'suspended'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {s.status === 'suspended' ? 'Suspended' : 'Active'}
                          </span>
                          {s.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleStaffStatus(s)}
                              className="block text-[10px] font-bold text-gray-500 hover:text-navy-950 underline transition-colors cursor-pointer"
                            >
                              {s.status === 'suspended' ? 'Activate' : 'Suspend'}
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Configured RBAC Permissions */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {s.permissions?.can_register_walkins && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 text-[9px] font-bold border border-purple-100">
                                Walk-ins
                              </span>
                            )}
                            {s.permissions?.can_checkout_guests && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 text-[9px] font-bold border border-purple-100">
                                Check-out
                              </span>
                            )}
                            {s.permissions?.can_view_financials && (
                              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-900 text-[9px] font-bold border border-purple-100">
                                Financials
                              </span>
                            )}
                            {s.permissions?.can_delete_bookings ? (
                              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 text-[9px] font-bold border border-rose-100">
                                Deletion Allowed
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-[9px] font-bold">
                                No Delete
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleOpenEditPermissions(s)}
                            className="text-[10px] font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 underline pt-0.5 cursor-pointer"
                          >
                            <Sliders className="w-2.5 h-2.5" />
                            <span>Modify RBAC</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions: Reset Password, RBAC, Edit, Delete */}
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenResetPassword(s)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-bold inline-flex items-center gap-1 border border-amber-200 shadow-sm transition-all active:scale-95 cursor-pointer"
                            title="Reset Staff Password"
                          >
                            <Key className="w-3 h-3 text-amber-700" />
                            <span>Reset Password</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditPermissions(s)}
                            className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#2E0854] text-[11px] font-bold inline-flex items-center gap-1 border border-purple-200 transition-all cursor-pointer"
                            title="Configure Permissions"
                          >
                            <Sliders className="w-3 h-3 text-purple-700" />
                            <span>Permissions</span>
                          </button>

                          <button
                            onClick={() => handleOpenEditStaffModal(s)}
                            className="px-2.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold inline-flex items-center gap-1 border border-gray-200 transition-all cursor-pointer"
                            title="Edit Staff Info"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          {s.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteStaffAccount(s.id, s.full_name)}
                              className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold inline-flex items-center border border-rose-100 transition-all cursor-pointer"
                              title="Delete Staff"
                            >
                              <UserX className="w-3.5 h-3.5 text-rose-600" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Client Directory & Excel Export */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm p-6 space-y-6 animate-in fade-in">
          {/* Header Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase mb-1">
                <Users className="w-3.5 h-3.5" />
                <span>Aggregated Client Directory</span>
              </div>
              <h2 className="text-xl font-black text-navy-950">Client Directory & Contact Dossier</h2>
              <p className="text-xs text-gray-500 font-medium">
                Showing all unique clients collected from online bookings & walk-in front desk registrations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, email, or phone..."
                  value={clientSearchQuery}
                  onChange={(e) => setClientSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-navy-950 outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={handleExportClientsExcel}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export to Excel (.CSV)</span>
              </button>
            </div>
          </div>

          {/* Client Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                <tr>
                  <th className="p-4">Client Name & Contacts</th>
                  <th className="p-4">Total Reservations</th>
                  <th className="p-4">Total Paid Spend</th>
                  <th className="p-4">Last Reservation</th>
                  <th className="p-4">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
                {filteredClientsList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                      No client records match your search.
                    </td>
                  </tr>
                ) : (
                  filteredClientsList.map((c) => {
                    const cleanPhone = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
                    return (
                      <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-extrabold text-navy-950 text-xs">{c.name}</p>
                          <p className="text-gray-400 text-[11px] font-mono">{c.email}</p>
                          <p className="text-emerald-700 text-[11px] font-mono font-bold">{c.phone}</p>
                        </td>

                        <td className="p-4">
                          <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 text-xs font-black">
                            {c.totalBookings} Booking{c.totalBookings > 1 ? 's' : ''}
                          </span>
                        </td>

                        <td className="p-4 font-black text-emerald-700 text-sm">
                          ${c.totalSpend}
                        </td>

                        <td className="p-4 text-gray-600 font-mono text-xs">
                          {c.lastBookingDate}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${c.phone}`}
                              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                              title="Call Client"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 transition-colors"
                              title="WhatsApp Client"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                            <a
                              href={`mailto:${c.email}`}
                              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 transition-colors"
                              title="Email Client"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Revenue Accounting & Monthly Rollover System */}
      {activeTab === 'financials' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header Controls & Month Selector */}
          <div className="bg-navy-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-extrabold uppercase mb-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Executive Revenue Accounting</span>
              </div>
              <h2 className="text-2xl font-black">Monthly Accounting & Rollover Ledger</h2>
              <p className="text-xs text-gray-300">
                Only paid client bookings count toward revenue. Monthly counters reset automatically on the 1st of every month.
              </p>
            </div>

            {/* Month Selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-gold-400 font-extrabold uppercase">Accounting Month:</span>
              <select
                value={activeMonthKey}
                onChange={(e) => setSelectedMonthKey(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-xs font-black text-white outline-none cursor-pointer hover:bg-white/20 transition-all"
              >
                {availableMonths.length === 0 && <option value={currentMonthStr}>Current Month</option>}
                {availableMonths.map((mKey) => {
                  const [y, m] = mKey.split('-');
                  const d = new Date(parseInt(y), parseInt(m) - 1, 1);
                  const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
                  const isCurrent = mKey === currentMonthStr;
                  return (
                    <option key={mKey} value={mKey} className="text-navy-950">
                      {label} {isCurrent ? '(Current Month)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Monthly Revenue Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-50/80 to-white p-5 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                {activeMonthData.monthLabel} Paid Revenue
              </span>
              <div className="text-3xl font-black text-emerald-600">${activeMonthData.totalRevenue}</div>
              <span className="text-[10px] text-emerald-700 font-bold block">
                {activeMonthData.bookingsCount} Paid Booking{activeMonthData.bookingsCount !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="bg-gradient-to-br from-purple-50/80 to-white p-5 rounded-3xl border border-purple-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-purple-900 uppercase tracking-wider">
                Total Cumulative Revenue
              </span>
              <div className="text-3xl font-black text-purple-950">${totalPaidRevenue}</div>
              <span className="text-[10px] text-purple-800 font-bold block">All-time confirmed paid bookings</span>
            </div>

            <div className="bg-gradient-to-br from-amber-50/80 to-white p-5 rounded-3xl border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
                Short-Time Hourly Revenue
              </span>
              <div className="text-3xl font-black text-amber-600">${activeMonthData.shortTimeRevenue}</div>
              <span className="text-[10px] text-amber-700 font-bold block">2h / 4h / 6h Short Stays ({activeMonthData.monthLabel})</span>
            </div>

            <div className="bg-gradient-to-br from-blue-50/80 to-white p-5 rounded-3xl border border-blue-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider">
                Overnight Stay Revenue
              </span>
              <div className="text-3xl font-black text-blue-700">${activeMonthData.overnightRevenue}</div>
              <span className="text-[10px] text-blue-800 font-bold block">Nightly reservations ({activeMonthData.monthLabel})</span>
            </div>
          </div>

          {/* Detailed Monthly Paid Bookings Ledger Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-navy-950 text-base">
                Paid Transactions Ledger ({activeMonthData.monthLabel})
              </h3>
              <span className="text-xs font-bold text-gray-400">
                {activeMonthData.bookingsList.length} Confirmed Transactions
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                  <tr>
                    <th className="p-4">Ref ID</th>
                    <th className="p-4">Guest Client</th>
                    <th className="p-4">Category & Type</th>
                    <th className="p-4">Stay Dates</th>
                    <th className="p-4">Amount ($)</th>
                    <th className="p-4">Payment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
                  {activeMonthData.bookingsList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-400 font-bold">
                        No paid transactions recorded for {activeMonthData.monthLabel}.
                      </td>
                    </tr>
                  ) : (
                    activeMonthData.bookingsList.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 font-mono font-black text-gold-600">{b.id}</td>
                        <td className="p-4">
                          <p className="font-extrabold text-navy-950">{b.guest_name}</p>
                          <p className="text-gray-400 text-[11px] font-mono">{b.guest_phone}</p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            b.booking_category === 'short_time' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {b.booking_category === 'short_time' ? `Short-Time (${b.short_time_hours || 4}h)` : 'Overnight Stay'}
                          </span>
                        </td>
                        <td className="p-4 font-bold">{b.check_in} &rarr; {b.check_out}</td>
                        <td className="p-4 font-black text-emerald-600 text-sm">${b.total_price}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                            PAID & CONFIRMED
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Damaged & Missing Items Audit Portal */}
      {activeTab === 'incidents' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Header */}
          <div className="bg-rose-950 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-black uppercase mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Executive Inventory Audit Portal</span>
              </div>
              <h2 className="text-2xl font-black">Damaged & Missing Items Log</h2>
              <p className="text-xs text-rose-200 font-medium">
                Live audit record of inventory items reported missing or damaged during receptionist check-out room inspections.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-2xl bg-rose-900 border border-rose-700 text-white text-xs font-black">
                {incidentReports.filter(r => r.status === 'pending_review').length} Pending Review
              </span>
            </div>
          </div>

          {/* Audit Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-rose-50 to-white p-5 rounded-3xl border border-rose-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider">
                Pending Incidents
              </span>
              <div className="text-3xl font-black text-rose-600">
                {incidentReports.filter(r => r.status === 'pending_review').length}
              </div>
              <span className="text-[10px] text-rose-700 font-bold block">Awaiting admin review / resolution</span>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white p-5 rounded-3xl border border-amber-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider">
                Est. Pending Penalties
              </span>
              <div className="text-3xl font-black text-amber-600">
                ${incidentReports.filter(r => r.status === 'pending_review').reduce((sum, r) => sum + (r.estimated_penalty || 0), 0)}
              </div>
              <span className="text-[10px] text-amber-700 font-bold block">Estimated charges to be settled</span>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-3xl border border-emerald-200 shadow-sm space-y-1">
              <span className="text-[10px] font-black text-emerald-900 uppercase tracking-wider">
                Resolved Incidents
              </span>
              <div className="text-3xl font-black text-emerald-600">
                {incidentReports.filter(r => r.status === 'resolved').length}
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block">Items settled / replaced</span>
            </div>
          </div>

          {/* Incident Reports Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-navy-950 text-base">
                Check-Out Incident Dossiers ({incidentReports.length})
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[800px]">
                <thead className="bg-gray-50 text-gray-400 uppercase font-black border-b border-gray-100">
                  <tr>
                    <th className="p-4">Report ID & Date</th>
                    <th className="p-4">Residence & Booking</th>
                    <th className="p-4">Guest Details</th>
                    <th className="p-4">Inspected By</th>
                    <th className="p-4 min-w-[220px]">Missing / Damaged Items</th>
                    <th className="p-4">Penalty ($)</th>
                    <th className="p-4">Status & Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-navy-950">
                  {incidentReports.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400 font-bold">
                        No damaged or missing items recorded yet.
                      </td>
                    </tr>
                  ) : (
                    incidentReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <span className="font-mono font-black text-rose-700 block">{report.id}</span>
                          <span className="text-[10px] text-gray-400 font-mono">{report.created_at}</span>
                        </td>

                        <td className="p-4">
                          <p className="font-extrabold text-navy-950">{report.property_title}</p>
                          <span className="text-[10px] text-purple-900 font-bold font-mono">Ref: #{report.booking_id}</span>
                        </td>

                        <td className="p-4">
                          <p className="font-extrabold text-navy-950">{report.guest_name}</p>
                          <p className="text-emerald-700 text-[11px] font-mono font-bold">{report.guest_phone}</p>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-navy-950">{report.inspected_by_name}</p>
                          <span className="text-[10px] text-gray-400 capitalize">({report.inspected_by_role})</span>
                        </td>

                        <td className="p-4 space-y-1">
                          {report.missing_or_damaged_items.map((item, idx) => (
                            <div key={idx} className="bg-rose-50 p-2 rounded-xl border border-rose-200 text-xs">
                              <p className="font-black text-rose-950 flex items-center justify-between">
                                <span>{item.item_name} (x{item.expected_qty})</span>
                                <span className="text-[9px] uppercase bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded-md font-bold">{item.category}</span>
                              </p>
                              {item.notes && (
                                <p className="text-[10px] text-rose-800 italic mt-0.5">"{item.notes}"</p>
                              )}
                            </div>
                          ))}
                        </td>

                        <td className="p-4 font-black text-rose-600 text-sm">
                          ${report.estimated_penalty || 0}
                        </td>

                        <td className="p-4">
                          {report.status === 'pending_review' ? (
                            <div className="space-y-2">
                              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider block text-center animate-pulse">
                                Pending Review
                              </span>
                              <button
                                onClick={() => handleResolveIncidentReport(report.id)}
                                className="w-full px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black shadow-sm transition-all active:scale-95 cursor-pointer"
                              >
                                Mark Resolved
                              </button>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider block text-center">
                              Resolved / Settled
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
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
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'stays' ? 'bg-navy-950 text-white border-navy-950' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Bed className="w-4 h-4 text-gold-400" />
                    <span>Stays</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectModalVertical('cars')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${propVertical === 'cars' ? 'bg-navy-950 text-white border-navy-950' : 'bg-gray-50 border-gray-200 text-gray-700'}`}
                  >
                    <Car className="w-4 h-4 text-gold-400" />
                    <span>Cars</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectModalVertical('experiences')}
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
                disabled={isSavingProperty}
                className="w-full py-3.5 bg-navy-950 text-white font-black text-xs rounded-xl shadow-md hover:bg-navy-900 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSavingProperty ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4 text-gold-400" />
                )}
                <span>
                  {isSavingProperty
                    ? (editingProperty ? 'Updating Listing Details...' : 'Publishing Listing to Platform...')
                    : (editingProperty ? 'Update Listing Details' : 'Publish Listing to Platform')}
                </span>
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
      {/* Modal: Create or Edit Staff Account */}
      {showStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-gray-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#2E0854]">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-navy-950 text-base">
                    {editingStaff ? `Edit Staff: ${editingStaff.full_name}` : 'Register Staff Account'}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Create credentials for Managers & Receptionists to access their console desks
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowStaffModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {staffErrorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-semibold p-3.5 rounded-2xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{staffErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveStaffAccount} className="space-y-4">
              
              {/* Role Selection Cards */}
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1.5 tracking-wider">
                  Select Role & Responsibility
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStaffRole('receptionist');
                      setStaffPermWalkin(true);
                      setStaffPermCheckout(true);
                      setStaffPermStatus(true);
                      setStaffPermFinancials(true);
                      setStaffPermMessages(true);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                      staffRole === 'receptionist'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md scale-[1.02]'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <UserCheck className={`w-5 h-5 ${staffRole === 'receptionist' ? 'text-white' : 'text-emerald-600'}`} />
                    <span className="text-xs font-black">Receptionist</span>
                    <span className={`text-[9px] leading-tight ${staffRole === 'receptionist' ? 'text-emerald-100' : 'text-gray-400'}`}>
                      Front Desk, Check-In/Out
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStaffRole('manager');
                      setStaffPermWalkin(true);
                      setStaffPermCheckout(true);
                      setStaffPermStatus(true);
                      setStaffPermFinancials(true);
                      setStaffPermMessages(true);
                    }}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                      staffRole === 'manager'
                        ? 'bg-amber-800 text-white border-amber-800 shadow-md scale-[1.02]'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <Briefcase className={`w-5 h-5 ${staffRole === 'manager' ? 'text-white' : 'text-amber-600'}`} />
                    <span className="text-xs font-black">Manager</span>
                    <span className={`text-[9px] leading-tight ${staffRole === 'manager' ? 'text-amber-100' : 'text-gray-400'}`}>
                      Console & Inventory Oversight
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setStaffRole('admin')}
                    className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1 transition-all cursor-pointer ${
                      staffRole === 'admin'
                        ? 'bg-navy-950 text-white border-navy-950 shadow-md scale-[1.02]'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <ShieldCheck className={`w-5 h-5 ${staffRole === 'admin' ? 'text-gold-400' : 'text-purple-700'}`} />
                    <span className="text-xs font-black">Admin</span>
                    <span className={`text-[9px] leading-tight ${staffRole === 'admin' ? 'text-purple-200' : 'text-gray-400'}`}>
                      Executive Platform Access
                    </span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={staffFullName}
                  onChange={(e) => setStaffFullName(e.target.value)}
                  placeholder="e.g. Kwame Mensah"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-navy-950 outline-none focus:bg-white focus:border-purple-600 transition-all"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Email Address (Login Username)</label>
                <input
                  type="email"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  disabled={Boolean(editingStaff)}
                  placeholder={staffRole === 'manager' ? 'e.g. kwame.manager@reetay.com' : 'e.g. kwame.reception@reetay.com'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-navy-950 outline-none disabled:opacity-50 focus:bg-white focus:border-purple-600 transition-all"
                  required
                />
              </div>

              {/* Password with Auto-Generator and Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-black text-gray-400">Login Password</label>
                  <button
                    type="button"
                    onClick={handleGeneratePassword}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                  >
                    ⚡ Auto-Generate
                  </button>
                </div>
                <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 flex items-center gap-2 focus-within:border-purple-600 focus-within:bg-white transition-all">
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type={showStaffPassword ? 'text' : 'password'}
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-transparent text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-[10px] uppercase font-black text-gray-400 block mb-1">Phone Number (Optional)</label>
                <input
                  type="text"
                  value={staffPhone}
                  onChange={(e) => setStaffPhone(e.target.value)}
                  placeholder="e.g. +233 24 123 4567"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-navy-950 outline-none focus:bg-white focus:border-purple-600 transition-all"
                />
              </div>

              {/* Feature Access & Permission Configurator */}
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-2.5 text-xs">
                <span className="text-[10px] font-black uppercase text-purple-950 block tracking-wider">
                  Configured Desk & Console Permissions
                </span>

                <label className="flex items-center gap-2.5 cursor-pointer text-navy-950 font-bold text-xs">
                  <input
                    type="checkbox"
                    checked={staffPermWalkin}
                    onChange={(e) => setStaffPermWalkin(e.target.checked)}
                    className="accent-purple-700 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Register Walk-in Guests & Short-Time Stays</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-navy-950 font-bold text-xs">
                  <input
                    type="checkbox"
                    checked={staffPermCheckout}
                    onChange={(e) => setStaffPermCheckout(e.target.checked)}
                    className="accent-purple-700 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Perform Client Check-Out & Release Rooms</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-navy-950 font-bold text-xs">
                  <input
                    type="checkbox"
                    checked={staffPermStatus}
                    onChange={(e) => setStaffPermStatus(e.target.checked)}
                    className="accent-purple-700 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Edit Reservation Status & Arrival Flags</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-navy-950 font-bold text-xs">
                  <input
                    type="checkbox"
                    checked={staffPermFinancials}
                    onChange={(e) => setStaffPermFinancials(e.target.checked)}
                    className="accent-purple-700 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>View Revenue Stats & Daily Financial Totals</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer text-navy-950 font-bold text-xs">
                  <input
                    type="checkbox"
                    checked={staffPermMessages}
                    onChange={(e) => setStaffPermMessages(e.target.checked)}
                    className="accent-purple-700 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>Send Guest Email Communications & Notifications</span>
                </label>

                {staffRole === 'receptionist' && (
                  <p className="text-[10px] text-rose-700 font-bold italic pt-1.5 border-t border-purple-200/60">
                    * Policy: Receptionist accounts are restricted from permanently deleting bookings.
                  </p>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowStaffModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  {editingStaff ? 'Save Staff Updates' : `Register ${staffRole.toUpperCase()} Account`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Admin Staff Password Reset */}
      {showResetPasswordModal && passwordResetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 border border-gray-100 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-navy-950 text-base">
                    Reset Password: {passwordResetTarget.full_name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium capitalize">
                    {passwordResetTarget.role} • {passwordResetTarget.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-black text-gray-400">New Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                      setResetPasswordValue(passwordResetTarget.role === 'manager' ? `Mgr#${randomSuffix}` : `Staff#${randomSuffix}`);
                    }}
                    className="text-[10px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200 cursor-pointer"
                  >
                    ⚡ Auto-Generate
                  </button>
                </div>
                <div className="relative bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 flex items-center gap-2 focus-within:border-purple-600 focus-within:bg-white transition-all">
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type={showResetPasswordPlain ? 'text' : 'password'}
                    value={resetPasswordValue}
                    onChange={(e) => setResetPasswordValue(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-transparent text-xs font-bold text-navy-950 outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPasswordPlain(!showResetPasswordPlain)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showResetPasswordPlain ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/70 text-xs text-amber-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Immediate Credential Update</span>
                </p>
                <p className="text-[11px] text-amber-900 leading-relaxed">
                  The staff member will be required to authenticate with this new password on their next login session at <strong>/admin/login</strong>.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Confirm & Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Granular RBAC Permissions Configurator */}
      {showPermissionsModal && permissionsEditTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-gray-100 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#2E0854]">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-navy-950 text-base">
                    Access Control: {permissionsEditTarget.full_name}
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium capitalize">
                    Assigned Role: {permissionsEditTarget.role} • {permissionsEditTarget.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Preset Template Buttons */}
            <div>
              <label className="text-[10px] uppercase font-black text-gray-400 block mb-1.5">
                Apply Role Preset Template
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEditablePermissions({ ...DEFAULT_RECEPTIONIST_PERMISSIONS })}
                  className="py-2 px-3 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-extrabold transition-colors text-center cursor-pointer"
                >
                  Receptionist Preset
                </button>
                <button
                  type="button"
                  onClick={() => setEditablePermissions({ ...DEFAULT_MANAGER_PERMISSIONS })}
                  className="py-2 px-3 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-extrabold transition-colors text-center cursor-pointer"
                >
                  Manager Preset
                </button>
                <button
                  type="button"
                  onClick={() => setEditablePermissions({ ...DEFAULT_ADMIN_PERMISSIONS })}
                  className="py-2 px-3 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-[#2E0854] text-[11px] font-extrabold transition-colors text-center cursor-pointer"
                >
                  Admin Preset
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePermissions} className="space-y-4">
              
              {/* Category 1: Front Desk Operations */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2.5 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-purple-900 block tracking-wider">
                  1. Front Desk Operations
                </span>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_register_walkins}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_register_walkins: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Register Walk-in Guests & Short-Time Stays</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_checkin_guests}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_checkin_guests: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Perform Guest Check-in & Key Release</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_checkout_guests}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_checkout_guests: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Perform Guest Check-out & Room Release</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_update_room_status}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_update_room_status: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Update Housekeeping & Turnover Status</span>
                </label>
              </div>

              {/* Category 2: Reservations & Pricing Control */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2.5 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-purple-900 block tracking-wider">
                  2. Reservations & Pricing Control
                </span>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_edit_booking_status}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_edit_booking_status: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Edit Reservation Status & Arrival Flags</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_cancel_bookings}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_cancel_bookings: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Cancel Reservations & Release Units</span>
                </label>
                <label className="flex items-center gap-2.5 text-rose-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_delete_bookings}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_delete_bookings: e.target.checked })}
                    className="accent-rose-600 w-4 h-4 rounded"
                  />
                  <span>Permanently Delete Bookings (High Risk)</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_override_pricing}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_override_pricing: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Manual Price Overrides & Custom Discounts</span>
                </label>
              </div>

              {/* Category 3: Financial Oversight & Reports */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2.5 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-purple-900 block tracking-wider">
                  3. Financial Oversight & Reports
                </span>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_view_financials}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_view_financials: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>View Daily Cash Collections & Revenue Totals</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_view_revenue_reports}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_view_revenue_reports: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Monthly Revenue Accounting & Rollover Reports</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_process_refunds}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_process_refunds: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Process Guest Refunds & Deposit Returns</span>
                </label>
              </div>

              {/* Category 4: Inventory & Communications */}
              <div className="border border-gray-100 rounded-2xl p-4 space-y-2.5 bg-gray-50/50">
                <span className="text-[10px] font-black uppercase text-purple-900 block tracking-wider">
                  4. Inventory & Guest Communications
                </span>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_manage_inventory}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_manage_inventory: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Add, Edit, and Manage Listings & Fleet Vehicles</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_lock_calendar}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_lock_calendar: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Calendar Lock & Date Guard</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_send_messages}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_send_messages: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Send Guest Email Communications & Notifications</span>
                </label>
                <label className="flex items-center gap-2.5 text-navy-950 font-bold text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editablePermissions.can_settle_incidents}
                    onChange={(e) => setEditablePermissions({ ...editablePermissions, can_settle_incidents: e.target.checked })}
                    className="accent-purple-700 w-4 h-4 rounded"
                  />
                  <span>Settle Damaged / Missing Item Incident Reports</span>
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-extrabold text-xs shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  Enforce Access Permissions
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

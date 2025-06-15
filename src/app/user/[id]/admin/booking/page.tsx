'use client';

import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";

interface Booking {
  id: string;
  date_start: string;
  date_end: string;
  status: string;
  admin: string;
  admin_id: string;
  admin_approval: string;
  corp: string;
  corp_id: string;
  corp_approval: string;
  vehicle: string;
  driver: string;
  vehicle_id: string;
  driver_id: string;
}

export default function BookingPage() {
  const params = useParams();
  const userId = params?.id as string | undefined;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<Record<string, any>>({});
  const [vehicles, setVehicles] = useState<Record<string, any>>({});
  const [corps, setCorps] = useState<Record<string, any>>({});
  const [admins, setAdmins] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    date_start: '',
    date_end: '',
    corp: '',
    vehicle: '',
    driver: '',
    admin_approval: 'PENDING',
    corp_approval: 'PENDING',
    status: 'PENDING',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  async function fetchData() {
    try {
      const bookingRes = await api.get("/booking");
      if (bookingRes) {
        setBookings(bookingRes.data);
      }



      const driverRes = await api.get("/driver");
      if(driverRes){
        const driverMap: Record<string, any> = {};
        for(const driver of driverRes.data) {
          if(driver && driver.id){
            driverMap[driver.id] = driver;
          }
        }
        setDrivers(driverMap);
      }
      const vehicleRes = await api.get("/car");
      if(vehicleRes){
        const vehicleMap: Record<string, any> = {};
        for(const vehicle of vehicleRes.data) {
          if(vehicle && vehicle.id){
            vehicleMap[vehicle.id] = vehicle;
          }
        }
        setVehicles(vehicleMap);
      }

      const userRes = await api.get("/user");
      if(userRes){
        const userData = userRes.data;
        setCorps(userData.filter((user: any) => user.is_admin === false));
        setAdmins(userData.filter((user: any) => user.is_admin === true));
      

      const adminMap: Record<string, any> = {};
      const corpsMap: Record<string, any> = {};
      for(const user of userRes.data) {
        if(user && user.id){
          if(user.is_admin === false) {corpsMap[user.id] = user;}
          else if(user.is_admin === true){adminMap[user.id] = user;}
        }
      }
      setAdmins(adminMap);
      setCorps(corpsMap);
    }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
      setDrivers([]);
      setVehicles([]);
      setCorps([]);
      setAdmins([]);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const bookingMapped = bookings.map((row) => ({
      ...row,
      admin: admins[row.admin_id]?.username || row.admin,
      corp: corps[row.corp_id]?.username || row.corp,
      vehicle: vehicles[row.vehicle_id]?.name || row.vehicle,
      driver: drivers[row.driver_id]?.name || row.driver,
    }));

  const handleApprove = async (id: string) => {
    await api.patch(`/booking/${id}`, { admin_approval: 'APPROVED' });
    fetchData();
  };
  const handleDisapprove = async (id: string) => {
    await api.patch(`/booking/${id}`, { admin_approval: 'REJECTED' });
    fetchData();
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/booking/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/booking', {
        date_start: form.date_start,
        date_end: form.date_end,
        corp_id: form.corp,
        admin_id: userId,
        vehicle_id: form.vehicle,
        driver_id: form.driver,
        admin_approval: 'PENDING',
        corp_approval: 'PENDING'
      });
      setShowModal(false);
      setForm({ date_start: '', date_end: '', corp: '', vehicle: '', driver: '', admin_approval: 'PENDING', corp_approval: 'PENDING', status: 'PENDING' });
      fetchData();
    } catch (error) {
      console.error('Error creating booking:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (booking: Booking) => {
    setForm({
      date_start: booking.date_start,
      date_end: booking.date_end,
      corp: booking.corp_id,
      vehicle: booking.vehicle_id,
      driver: booking.driver_id,
      admin_approval: booking.admin_approval,

      corp_approval: 'PENDING',
      status: 'PENDING', // not shown in edit modal, but kept for form reset
    });
    setEditId(booking.id);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setForm({ date_start: '', date_end: '', corp: '', vehicle: '', driver: '', admin_approval: 'PENDING', corp_approval: 'PENDING', status: 'PENDING' });
    setEditId(null);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editId) {
        await api.patch(`/booking/${editId}`, {
          date_start: form.date_start,
          date_end: form.date_end,
          corp_id: form.corp,
          admin_id: userId,
          vehicle_id: form.vehicle,
          driver_id: form.driver,
        });
        setShowModal(false);
        setForm({ date_start: '', date_end: '', corp: '', vehicle: '', driver: '', admin_approval: 'PENDING', corp_approval: 'PENDING', status: 'PENDING' });
        setEditId(null);
        fetchData();
      }
    } catch (error) {
      console.error('Error editing booking:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.post(
        '/booking/export',{},
        { responseType: 'blob' },
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bookings.xlsx');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (err: any) {
      console.error('Export error:', err);
    }
  };


  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-2">
        <h1 className="text-3xl font-bold">Booking</h1>
        <div className="flex items-center gap-2">
          <button
            className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors"
            onClick={handleExport}
          >
            Export
          </button>
          <button className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors" onClick={() => setShowModal(true)}>Create</button>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6 border border-muted overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-muted-foreground">Date Start</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Date End</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Status</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Admin</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Admin Status</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Corp</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Corp Status</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Vehicle</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Driver</th>
              <th className="px-4 py-2 text-left text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="text-center text-muted-foreground py-8">Loading...</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center text-muted-foreground py-8">No bookings found.</td>
              </tr>
            ) : (
              bookingMapped.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-2">{booking.date_start}</td>
                  <td className="px-4 py-2">{booking.date_end}</td>
                  <td className="px-4 py-2">{booking.status}</td>
                  <td className="px-4 py-2">{booking.admin}</td>
                  <td className="px-4 py-2">
                    {userId && booking.admin_id === userId && booking.admin_approval === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => handleApprove(booking.id)}>Approve</button>
                        <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => handleDisapprove(booking.id)}>Disapprove</button>
                      </div>
                    ) : (
                      booking.admin_approval
                    )}
                  </td>
                  <td className="px-4 py-2">{booking.corp}</td>
                  <td className="px-4 py-2">{booking.corp_approval}</td>
                  <td className="px-4 py-2">{booking.vehicle}</td>
                  <td className="px-4 py-2">{booking.driver}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 mr-2"
                      onClick={() => handleEdit(booking)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for create/edit booking */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={handleModalClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Booking' : 'Create Booking'}</h2>
            <form className="space-y-4" onSubmit={editId ? handleEditSubmit : handleSubmit}>
              <div>
                <label className="block mb-1 font-medium">Date Start</label>
                <input className="w-full border rounded px-3 py-2" type="date" name="date_start" value={form.date_start} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Date End</label>
                <input className="w-full border rounded px-3 py-2" type="date" name="date_end" value={form.date_end} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Corp</label>
                <select className="w-full border rounded px-3 py-2" name="corp" value={form.corp} onChange={handleChange} required>
                  <option value="">Select Corp</option>
                  {Object.values(corps).map((corp) => (
                    <option key={corp.id} value={corp.id}>{corp.username}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Vehicle</label>
                <select className="w-full border rounded px-3 py-2" name="vehicle" value={form.vehicle} onChange={handleChange} required>
                  <option value="">Select Vehicle</option>
                  {Object.values(vehicles).map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Driver</label>
                <select className="w-full border rounded px-3 py-2" name="driver" value={form.driver} onChange={handleChange} required>
                  <option value="">Select Driver</option>
                  {Object.values(drivers).map((driver) => (
                    <option key={driver.id} value={driver.id}>{driver.name}</option>
                  ))}
                </select>
              </div>
              {!editId && (
                <div>
                  <label className="block mb-1 font-medium">Approval</label>
                  <select className="w-full border rounded px-3 py-2" name="admin_approval" value={form.admin_approval} onChange={handleChange} required>
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                  </select>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                  onClick={handleModalClose}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/90"
                  disabled={submitting}
                >
                  {submitting ? (editId ? 'Saving...' : 'Creating...') : (editId ? 'Save' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

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
}

export default function BookingPage() {
  const params = useParams();
  const userId = params?.id as string | undefined;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [corps, setCorps] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const bookingRes = await api.get("/booking");
      if(bookingRes){setBookings(bookingRes.data);}

      const driverRes = await api.get("/driver");
      if(driverRes){setDrivers(driverRes.data);}
      const vehicleRes = await api.get("/car");
      if(vehicleRes){setVehicles(vehicleRes.data);}

      const userRes = await api.get("/user");
      if(userRes){
        const userData = userRes.data;
        setCorps(userData.filter((user: any) => user.is_admin === false));
        setAdmins(userData.filter((user: any) => user.is_admin === true));
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

  const bookingMapped = useMemo(() => {
    return bookings.map((booking) => ({
      ...booking,
      admin: admins.find((admin: any) => admin.id === booking.admin)?.username || booking.admin,
      corp: corps.find((corp: any) => corp.id === booking.corp)?.username || booking.corp,
      vehicle: vehicles.find((vehicle: any) => vehicle.id === booking.vehicle)?.name || booking.vehicle,
      driver: drivers.find((driver: any) => driver.id === booking.driver)?.name || booking.driver,
    }));
  }, [bookings, admins, corps, vehicles, drivers]);

  const handleCorpApprove = async (id: string) => {
    await api.patch(`/booking/${id}`, { corp_approval: 'APPROVED' });
    fetchData();
  };
  const handleCorpDisapprove = async (id: string) => {
    await api.patch(`/booking/${id}`, { corp_approval: 'REJECTED' });
    fetchData();
  };
  return (
    <>
      <div className="flex items-center justify-between mb-6 gap-2">
        <h1 className="text-3xl font-bold">Booking</h1>
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
                  <td className="px-4 py-2">{booking.admin_approval}</td>
                  <td className="px-4 py-2">{booking.corp}</td>
                  <td className="px-4 py-2">
                    {userId && booking.corp_id === userId && booking.corp_approval === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700" onClick={() => handleCorpApprove(booking.id)}>Approve</button>
                        <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700" onClick={() => handleCorpDisapprove(booking.id)}>Disapprove</button>
                      </div>
                    ) : (
                      booking.corp_approval
                    )}
                  </td>
                  <td className="px-4 py-2">{booking.vehicle}</td>
                  <td className="px-4 py-2">{booking.driver}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

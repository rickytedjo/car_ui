'use client';

import React, { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Booking {
  id: string;
  vehicle_id: string;
}

interface Vehicle {
  id: string;
  name: string;
}

interface VehicleCount {
  vehicle_id: string;
  count: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<VehicleCount[]>([]);
  const [vehicles, setVehicles] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [bookingRes, carRes] = await Promise.all([
          api.get("/booking"),
          api.get("/car"),
        ]);
        const bookings: Booking[] = bookingRes.data;
        const cars: Vehicle[] = carRes.data;
        // Map vehicle_id to name
        const vehicleMap: Record<string, string> = {};
        cars.forEach((car) => {
          vehicleMap[car.id] = car.name;
        });
        setVehicles(vehicleMap);
        // Count bookings per vehicle_id
        const countMap: Record<string, number> = {};
        bookings.forEach((b) => {
          if (b.vehicle_id) {
            countMap[b.vehicle_id] = (countMap[b.vehicle_id] || 0) + 1;
          }
        });
        setData(Object.entries(countMap).map(([vehicle_id, count]) => ({ vehicle_id, count })));
      } catch (e) {
        setData([]);
        setVehicles({});
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-8 min-h-[300px] border border-muted">
        <h2 className="text-xl font-semibold mb-4">Number of Bookings per Vehicle this Month</h2>
        {loading ? (
          <div className="w-full h-64 flex items-center justify-center text-muted-foreground">Loading...</div>
        ) : data.length === 0 ? (
          <div className="w-full h-64 flex items-center justify-center text-muted-foreground">No data</div>
        ) : (
          <div className="w-full h-64 flex items-end gap-4">
            {data.map((item) => (
              <div key={item.vehicle_id} className="flex flex-col items-center flex-1">
                <div
                  className="bg-primary/70 rounded-t w-10"
                  style={{ height: `${Math.max(item.count * 30, 10)}px` }}
                  title={`Vehicle: ${vehicles[item.vehicle_id] || item.vehicle_id}, Bookings: ${item.count}`}
                ></div>
                <span className="mt-2 text-xs break-all text-center">{vehicles[item.vehicle_id] || item.vehicle_id}</span>
                <span className="text-sm font-bold">{item.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

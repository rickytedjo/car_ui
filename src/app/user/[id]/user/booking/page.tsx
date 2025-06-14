import React from "react";

export default function BookingPage() {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Booking</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md shadow hover:bg-primary/90 transition-colors">Create</button>
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
            {/* Empty table body */}
            <tr>
              <td colSpan={9} className="text-center text-muted-foreground py-8">No bookings found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

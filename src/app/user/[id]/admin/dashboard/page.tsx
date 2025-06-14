import React from "react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-8 flex items-center justify-center min-h-[300px] border border-muted">
        {/* Empty graph placeholder */}
        <div className="w-full h-64 flex items-center justify-center text-muted-foreground">
          <span className="text-lg">[Empty Graph]</span>
        </div>
      </div>
    </div>
  );
}

import SidebarLayout from "../SidebarLayout";

export default function DashboardAdminLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}

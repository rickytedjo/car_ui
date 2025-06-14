import SidebarLayout from "../SidebarLayout";

export default function UserAdminLayout({ children }: { children: React.ReactNode }) {
  return <SidebarLayout>{children}</SidebarLayout>;
}

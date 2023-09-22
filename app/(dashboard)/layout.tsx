// components
import Sidebar from "@/components/layout/Sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      {children}
    </div>
  );
}

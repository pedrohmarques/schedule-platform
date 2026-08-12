import Header from "@/components/dashboard/Header";

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

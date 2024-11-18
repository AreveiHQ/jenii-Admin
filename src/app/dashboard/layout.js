import Sidebar, { SidebarItem, SignOutButton } from "@/components/sidebar";
import { Shop } from "iconoir-react";
import { BarChart3, Boxes, LayoutDashboard, Package, Plus, UserCircle } from "lucide-react";
import React from "react";
const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem icon={<LayoutDashboard size={20}/>} text="Dashboard" path="/dashboard"/>
        <SidebarItem icon={<BarChart3 size={20}/>} text="Statistics" path="/dashboard/stats" />
        <SidebarItem icon={<UserCircle size={20}/>} text="Users" path="/dashboard/users" />
        <SidebarItem icon={<Shop size={20}/>} text="Products" path="/dashboard/products"/>
        <SidebarItem icon={<Plus size={20}/>} text="Add Products" path="/dashboard/products/add"/>
        <SidebarItem icon={<Boxes size={20}/>} text="Inventory" />
        <SidebarItem icon={<Package size={20}/>} text="Orders" />

      </Sidebar>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-indigo-600 font-mono">Jenii Admin Panel</h2>
          <div>
            <SignOutButton/>
          </div>
        </header>
        <section className="bg-white shadow-md rounded-lg p-6">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;

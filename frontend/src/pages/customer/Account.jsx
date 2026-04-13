import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { User, MapPin, Package, LogOut, Heart, Edit, ChevronRight, Bell, HelpCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/auth?redirect=/account"); }
  }, [user]);

  const handleLogout = () => { logout(); };

  if (!user) return null;

  const menuItems = [
    { icon: Package, label: "My Orders", href: "/orders", desc: "Track and manage your orders" },
    { icon: MapPin, label: "Manage Addresses", href: "/account/addresses", desc: "Add and manage delivery addresses" },
    { icon: CreditCard, label: "Wallet", href: "/wallet", desc: "View your wallet balance and history" },
    { icon: Edit, label: "Edit Profile", href: "/account/edit", desc: "Update your personal information" },
  ];

  return (
    <div className="min-h-screen bg-[#fffdfe]">
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 mb-6 border border-pink-100">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback className="bg-gradient-to-r from-pink-500 to-purple-500 text-white text-2xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user.name || "User"}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              {user.phone && <p className="text-gray-500 text-sm">{user.phone}</p>}
            </div>
            <Link to="/account/edit">
              <Button variant="outline" size="sm" className="border-pink-200 text-pink-600 hover:bg-pink-50">
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </Link>
          </div>
        </div>

        {/* Menu Items */}
        <Card className="mb-6">
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={index}>
                <Link to={item.href} className="flex items-center p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center mr-4">
                    <item.icon className="h-5 w-5 text-pink-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-0">
            <button onClick={handleLogout} className="flex items-center p-4 w-full hover:bg-red-50 transition-colors rounded-xl">
              <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mr-4">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-red-500">Log Out</p>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

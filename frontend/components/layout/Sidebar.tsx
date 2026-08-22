'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Bot, 
  Target, 
  Layers, 
  Receipt, 
  Users, 
  Landmark, 
  Handshake, 
  Activity, 
  AlertTriangle, 
  BarChart3, 
  History, 
  TestTube, 
  Settings
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Agent', href: '/agent', icon: Bot },
  { name: 'Opportunities', href: '/opportunities', icon: Target },
  { name: 'Batches', href: '/batches', icon: Layers },
  { name: 'Transactions', href: '/transactions', icon: Receipt },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Receivables', href: '/receivables', icon: Landmark },
  { name: 'Promises', href: '/promises', icon: Handshake },
  { name: 'Recovery Actions', href: '/actions', icon: Activity },
  { name: 'Escalations', href: '/escalations', icon: AlertTriangle },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Audit Trail', href: '/audit', icon: History },
  { name: 'Simulator', href: '/simulator', icon: TestTube },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 h-full bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-gray-900 tracking-tight">Recover<span className="text-blue-600">AI</span></span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname !== '/' && item.href.startsWith(pathname));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`flex-shrink-0 mr-3 h-5 w-5 ${
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

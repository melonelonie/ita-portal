import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AppShellProps {
  role: 'admin' | 'ta';
}

export default function AppShell({ role }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#09090b] text-[#fafafa]">
      {/* Sidebar */}
      <Sidebar role={role} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

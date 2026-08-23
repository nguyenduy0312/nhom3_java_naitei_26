"use client";

import { useState } from "react";
import { Sidebar, Footer } from "@/components/layout";
import { Menu } from "lucide-react";

/**
 * User Layout — dùng cho khu vực client (người dùng cuối).
 * Bao gồm Header + Sidebar + nội dung chính + Footer.
 *
 * Lý do dùng Route Group (user):
 * - Tách biệt layout client khỏi admin, mỗi khu vực có sidebar/menu riêng.
 * - Route group không ảnh hưởng URL path: /dashboard, /expenses (không có /user/).
 */
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {/* Header thu nhỏ chỉ hiển thị trên Mobile */}
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2 font-bold text-[#004ac6]">
          FinTrack Pro
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-[#515f74] hover:bg-[#F8FAFC]"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Khu vực nội dung chính */}
      <div className="flex min-h-screen flex-col lg:pl-64">
        <main className="flex-1 p-4 lg:p-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}

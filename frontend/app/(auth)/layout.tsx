import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthCanvas3D } from "@/components/three/AuthCanvas3D";
import { FloatingParticles } from "@/components/auth/FloatingParticles";

const stats = ["6 CLUBS", "50+ CAMPUSES", "SEASON 1"];

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0C0C0A] text-[#F5F0E8]">
      {children}
    </div>
  );
}

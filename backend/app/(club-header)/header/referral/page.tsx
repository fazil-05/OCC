import { requireUser } from "@/lib/auth";
import { ReferralCodeCard } from "@/components/club-header/ReferralCodeCard";

export default async function HeaderReferralPage() {
  const user = await requireUser();
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#8C6DFD] font-semibold mb-2">Invite Students</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Referral <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Program</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Share your unique code to grow your club community.</p>
      </div>
      <ReferralCodeCard code={user.referralCode || "PENDING"} clubName={user.clubManaged?.name || "Your Club"} />
    </div>
  );
}

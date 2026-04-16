import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { ClubHeaderShell } from "@/components/club-header/ClubHeaderShell";

export default async function ClubHeaderLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  if (user.role !== "CLUB_HEADER") redirect("/dashboard");
  if (user.approvalStatus !== "APPROVED") redirect("/pending");

  return (
    <ClubHeaderShell
      user={{
        fullName: user.fullName,
        email: user.email,
        referralCode: user.referralCode ?? null,
        clubName: user.clubManaged?.name ?? "Your Club",
        clubIcon: user.clubManaged?.icon ?? "🏢",
      }}
    >
      {children}
    </ClubHeaderShell>
  );
}

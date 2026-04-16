import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { AnalyticsClient } from "@/components/club-header/HeaderAnalytics";
import {
  getClubOnboardingConfig,
  CLUB_ONBOARDING_VARIANT_COUNT,
} from "@/config/clubOnboardingQuestions";

const ANSWER_FIELDS = [
  "answer1",
  "answer2",
  "answer3",
  "answer4",
  "answer5",
] as const;

export default async function HeaderAnalyticsPage() {
  const user = await requireUser();
  const managedClub = user.clubManaged;
  const [totalMembers, totalPosts, referralMembers] = await Promise.all([
    prisma.referralStat.count({ where: { clubHeaderId: user.id } }),
    prisma.post.count({ where: { userId: user.id } }),
    managedClub
      ? prisma.referralStat.findMany({
          where: { clubHeaderId: user.id, clubId: managedClub.id },
          select: { studentId: true },
        })
      : Promise.resolve([]),
  ]);

  const studentIds = [...new Set(referralMembers.map((member) => member.studentId))];
  const onboardingRows =
    managedClub && studentIds.length
      ? await prisma.clubOnboarding.findMany({
          where: {
            clubSlug: managedClub.slug,
            userId: { in: studentIds },
          },
        })
      : [];

  const onboardingConfig = managedClub
    ? getClubOnboardingConfig(managedClub.slug, 0)
    : null;

  type OnboardRow = (typeof onboardingRows)[number];

  function insightsForVariant(rows: OnboardRow[], slug: string, variant: number) {
    if (rows.length === 0) return [];
    const config = getClubOnboardingConfig(slug, variant);
    return config.questions.map((question, index) => {
      const field = ANSWER_FIELDS[index];
      const total = rows.length;
      return {
        key: question.key,
        prompt: question.prompt,
        total,
        options: question.options.map((label) => {
          const count = rows.filter((row) => row[field] === label).length;
          return {
            label,
            count,
            percentage: total > 0 ? Math.round((count / total) * 100) : 0,
          };
        }),
      };
    });
  }

  const byVariant = new Map<number, OnboardRow[]>();
  for (const row of onboardingRows) {
    const v = Math.min(
      CLUB_ONBOARDING_VARIANT_COUNT - 1,
      Math.max(0, row.questionVariant ?? 0),
    );
    if (!byVariant.has(v)) byVariant.set(v, []);
    byVariant.get(v)!.push(row);
  }

  const onboardingInsightSections =
    managedClub && byVariant.size > 0
      ? [...byVariant.entries()]
          .sort((a, b) => a[0] - b[0])
          .map(([variant, rows]) => ({
            title: `Question set ${variant + 1} · ${rows.length} response${rows.length === 1 ? "" : "s"}`,
            insights: insightsForVariant(rows, managedClub.slug, variant),
          }))
      : [];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#8C6DFD] font-semibold mb-2">Insights</p>
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Club <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] to-[#8C6DFD]">Analytics</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Track your club's growth and engagement metrics.</p>
      </div>
      <AnalyticsClient
        totalMembers={totalMembers}
        totalPosts={totalPosts}
        onboardingInsightSections={onboardingInsightSections}
        clubName={onboardingConfig?.clubName ?? managedClub?.name ?? "Your Club"}
      />
    </div>
  );
}

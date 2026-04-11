import { OrbitCRUD } from "@/components/admin-cp/OrbitCRUD";
import { prisma } from "@/lib/prisma";

export default async function StaffOrbitPage() {
  let projects: any[] = [];

  try {
    const raw = await prisma.orbitProject.findMany({
      orderBy: { sortOrder: "asc" },
    });
    projects = raw.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch orbit projects:", error);
    // Graceful fallback if table is not yet created
  }

  return (
    <div className="space-y-6">
      <OrbitCRUD projects={projects} />
    </div>
  );
}

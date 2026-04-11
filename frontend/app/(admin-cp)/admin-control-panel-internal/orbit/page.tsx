import { OrbitCRUD } from "@/components/admin-cp/OrbitCRUD";
import { prisma } from "@/lib/prisma";

export default async function AdminCPOrbitPage() {
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
  } catch {
    // Table may not exist yet — show empty state
  }

  return <OrbitCRUD projects={projects} />;
}

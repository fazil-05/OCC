import { BackgroundFramePreloader } from "@/components/BackgroundFramePreloader";
import { LandingRoutePrefetch } from "@/components/LandingRoutePrefetch";
import HomePage from "@/app/pages/HomePage";
import { getSessionUser } from "@/lib/auth";

export default async function Page() {
  const user = await getSessionUser();
  return (
    <>
      <LandingRoutePrefetch />
      <BackgroundFramePreloader />
      <HomePage userId={user?.id} />
    </>
  );
}

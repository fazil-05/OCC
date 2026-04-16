"use client";

import * as React from "react";
import { ApplyGigButton } from "@/components/dashboard/ApplyGigButton";
import { EventCard } from "@/components/dashboard/EventCard";
import { GigCard } from "@/components/dashboard/GigCard";
import { RegisterEventButton } from "@/components/dashboard/RegisterEventButton";
import { OCCPostCard, type OCCPost } from "@/components/occ-dashboard/OCCPostCard";
import { cn } from "@/app/components/ui/utils";
import { motion } from "framer-motion";
import { FileImage, CalendarX, Briefcase } from "lucide-react";

function EmptyTabState({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-black/10 bg-black/[0.02] py-16 text-center sm:py-24">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-black/5 text-black/30">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black/60 sm:text-sm">
        {title}
      </h3>
      <p className="mt-2 text-xs font-medium text-black/40 sm:text-sm max-w-[250px]">
        {description}
      </p>
    </div>
  );
}

const tabs = ["Feed", "Events", "Gigs"] as const;
type TabKey = (typeof tabs)[number];

type ClubTabsProps = {
  posts: OCCPost[];
  currentUserId: string;
  events: Array<{
    id: string;
    title: string;
    description: string;
    venue: string;
    date: Date | string;
    imageUrl?: string | null;
    club?: { name: string; icon: string } | null;
    price?: number;
    registered?: boolean;
  }>;
  gigs: Array<{
    id: string;
    title: string;
    description: string;
    payMin: number;
    payMax: number;
    deadline?: Date | string | null;
    applied?: boolean;
  }>;
};

export function ClubTabs({ posts, events, gigs, currentUserId }: ClubTabsProps) {
  const [active, setActive] = React.useState<TabKey>("Feed");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-8 border-b border-black/5 pb-0">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={cn(
              "pb-4 text-[12px] font-black uppercase tracking-[0.3em] transition-all relative",
              active === tab 
                ? "text-[#5227FF]" 
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab}
            {active === tab && (
              <motion.div 
                layoutId="club-nav-underline"
                className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#5227FF] rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {active === "Feed" ? (
          posts.length > 0 ? (
            <div className="mx-auto flex w-full max-w-[min(100%,920px)] flex-col gap-6 sm:gap-8">
              {posts.map((post) => (
                <OCCPostCard key={post.id} post={post} currentUserId={currentUserId} />
              ))}
            </div>
          ) : (
            <EmptyTabState 
              title="No Posts Yet" 
              description="Members haven't shared anything in this club yet." 
              icon={FileImage} 
            />
          )
        ) : null}

        {active === "Events" ? (
          events.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {events.map((event) => (
                <div key={event.id} className="relative group">
                  <EventCard
                    event={event}
                    action={<RegisterEventButton eventId={event.id} registered={!!event.registered} />}
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyTabState 
              title="No Upcoming Events" 
              description="There are no scheduled events for this club right now." 
              icon={CalendarX} 
            />
          )
        ) : null}

        {active === "Gigs" ? (
          gigs.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {gigs.map((gig) => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  action={<ApplyGigButton gigId={gig.id} applied={!!gig.applied} />}
                />
              ))}
            </div>
          ) : (
            <EmptyTabState 
              title="No Gigs Available" 
              description="There are no active gig opportunities for this club at the moment." 
              icon={Briefcase} 
            />
          )
        ) : null}
      </div>
    </div>
  );
}

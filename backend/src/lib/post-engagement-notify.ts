import { prisma } from "@/lib/prisma";
import { isPusherServerConfigured, pusherServer } from "@/lib/pusher";
import { notifyAllAdmins } from "@/lib/notify-admins";

function postSnippet(caption: string | null, content: string | null): string {
  const t = (caption || content || "Post").trim();
  return t.length > 72 ? `${t.slice(0, 69)}…` : t;
}

/** Notify club header + all admins when someone likes a club post (not on unlike). */
export async function notifyPostLiked(args: {
  postId: string;
  clubId: string;
  headerId: string | null;
  likerId: string;
  likerName: string;
  caption: string | null;
  content: string | null;
}) {
  const { postId, clubId, headerId, likerId, likerName, caption, content } = args;
  const headerIsSelf = headerId != null && headerId === likerId;

  const snippet = postSnippet(caption, content);
  const title = "New like on your post";
  const message = `${likerName} liked “${snippet}”.`;

  if (headerId && !headerIsSelf) {
    try {
      const n = await prisma.notification.create({
        data: {
          userId: headerId,
          type: "post_like",
          title,
          message,
          data: { postId, clubId, actorUserId: likerId },
        },
      });
      if (isPusherServerConfigured()) {
        await pusherServer.trigger(`user-${headerId}`, "notification", {
          title,
          message,
          notificationId: n.id,
        });
      }
    } catch (e) {
      console.warn("[post-engagement-notify] header like notify failed:", e);
    }
  }

  try {
    await notifyAllAdmins("post_like", title, `${likerName} liked a post in club feed. “${snippet}”`, {
      postId,
      clubId,
      actorUserId: likerId,
    });
    if (isPusherServerConfigured()) {
      await pusherServer.trigger("admin-global", "social-activity", {
        kind: "like",
        actorName: likerName,
        summary: `liked “${snippet}”`,
        postId,
        clubId,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn("[post-engagement-notify] admin like notify failed:", e);
  }
}

/** Notify club header + admins of a new comment (PII-safe message). */
export async function notifyPostCommented(args: {
  postId: string;
  clubId: string;
  headerId: string | null;
  commenterId: string;
  commenterName: string;
  caption: string | null;
  content: string | null;
  commentPreview: string;
}) {
  const {
    postId,
    clubId,
    headerId,
    commenterId,
    commenterName,
    caption,
    content,
    commentPreview,
  } = args;

  const snippet = postSnippet(caption, content);
  const title = "New comment on your post";
  const message = `${commenterName} commented on “${snippet}”: “${commentPreview}”`;

  if (headerId && headerId !== commenterId) {
    try {
      const n = await prisma.notification.create({
        data: {
          userId: headerId,
          type: "post_comment",
          title,
          message,
          data: { postId, clubId, actorUserId: commenterId },
        },
      });
      if (isPusherServerConfigured()) {
        await pusherServer.trigger(`user-${headerId}`, "notification", {
          title,
          message,
          notificationId: n.id,
        });
      }
    } catch (e) {
      console.warn("[post-engagement-notify] header comment notify failed:", e);
    }
  }

  try {
    await notifyAllAdmins(
      "post_comment",
      "New post comment",
      `${commenterName} on “${snippet}”: “${commentPreview}”`,
      { postId, clubId, actorUserId: commenterId },
    );
    if (isPusherServerConfigured()) {
      await pusherServer.trigger("admin-global", "social-activity", {
        kind: "comment",
        actorName: commenterName,
        summary: `on “${snippet}”: “${commentPreview}”`,
        postId,
        clubId,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn("[post-engagement-notify] admin comment notify failed:", e);
  }
}

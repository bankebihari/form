import { siteConfig } from "@/config/site";
import { connectDB, hasDatabase } from "@/lib/db";
import { SETTINGS_ID, Setting } from "@/models/Setting";

export type SocialLinks = {
  youtube: string;
  instagram: string;
  facebook: string;
};

/**
 * Social links the owner can change from the panel.
 *
 * The values in `src/config/site.ts` are the starting point; anything saved in
 * the database wins. A blank value means "we do not have this account", and the
 * footer simply leaves that icon out rather than linking somewhere dead.
 */
export async function getSocialLinks(): Promise<SocialLinks> {
  const fallback: SocialLinks = {
    youtube: siteConfig.social.youtube,
    instagram: siteConfig.social.instagram,
    facebook: siteConfig.social.facebook,
  };

  if (!hasDatabase()) return fallback;

  try {
    await connectDB();
    const doc = await Setting.findById(SETTINGS_ID).lean();
    if (!doc?.social) return fallback;

    // A saved blank is a deliberate "remove it", so only an absent key falls back.
    return {
      youtube: doc.social.youtube ?? fallback.youtube,
      instagram: doc.social.instagram ?? fallback.instagram,
      facebook: doc.social.facebook ?? fallback.facebook,
    };
  } catch (error) {
    console.error("[settings] falling back to the bundled links:", error);
    return fallback;
  }
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, CheckCircle2, Loader2, Save } from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  YoutubeIcon,
} from "@/components/site/social-icons";
import { saveSocialLinksAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert, Card, CardBody, CardHeader } from "@/components/ui/primitives";
import type { SocialLinks } from "@/lib/settings";

const idle: ActionState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Saving...
        </>
      ) : (
        <>
          <Save className="h-4 w-4" aria-hidden />
          Save links
        </>
      )}
    </Button>
  );
}

export function SocialLinksForm({ links }: { links: SocialLinks }) {
  const [state, action] = useActionState(saveSocialLinksAction, idle);

  return (
    <Card>
      <CardHeader
        title="Social links"
        subtitle="Shown as icons in the website footer. Leave one blank to hide it."
      />
      <CardBody>
        <form action={action} className="space-y-4">
          <Field
            label="WhatsApp"
            htmlFor="whatsapp-note"
            help="Comes from your phone number in src/config/site.ts, so there is nothing to paste here."
          >
            <Input
              id="whatsapp-note"
              value="Uses your business number automatically"
              readOnly
              disabled
            />
          </Field>

          <Field
            label="Instagram"
            htmlFor="instagram"
            hint="Optional"
            help="Paste the full profile link, e.g. https://instagram.com/yourname"
          >
            <Input
              id="instagram"
              name="instagram"
              type="url"
              inputMode="url"
              defaultValue={links.instagram}
              placeholder="https://instagram.com/yourname"
              maxLength={300}
            />
          </Field>

          <Field
            label="Facebook"
            htmlFor="facebook"
            hint="Optional"
            help="Paste the full page link, e.g. https://facebook.com/yourpage"
          >
            <Input
              id="facebook"
              name="facebook"
              type="url"
              inputMode="url"
              defaultValue={links.facebook}
              placeholder="https://facebook.com/yourpage"
              maxLength={300}
            />
          </Field>

          <Field
            label="YouTube"
            htmlFor="youtube"
            hint="Optional"
            help="Paste the full channel link, e.g. https://youtube.com/@yourchannel"
          >
            <Input
              id="youtube"
              name="youtube"
              type="url"
              inputMode="url"
              defaultValue={links.youtube}
              placeholder="https://youtube.com/@yourchannel"
              maxLength={300}
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-canvas p-3.5">
            <span className="flex gap-2 text-navy-500">
              <InstagramIcon className="h-4.5 w-4.5" />
              <FacebookIcon className="h-4.5 w-4.5" />
              <YoutubeIcon className="h-4.5 w-4.5" />
            </span>
            <p className="flex-1 text-[12.5px] leading-relaxed text-muted">
              On a phone these open the Instagram, Facebook and YouTube apps
              directly, because the apps claim their own web links. Nothing extra
              is needed.
            </p>
          </div>

          <SubmitButton />
        </form>

        {state.message ? (
          <Alert
            tone={state.ok ? "success" : "danger"}
            className="mt-4"
            icon={
              state.ok ? (
                <CheckCircle2 className="h-5 w-5 text-success-600" aria-hidden />
              ) : (
                <AlertTriangle className="h-5 w-5 text-danger-600" aria-hidden />
              )
            }
          >
            {state.message}
          </Alert>
        ) : null}
      </CardBody>
    </Card>
  );
}

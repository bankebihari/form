"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  FileUp,
  Loader2,
  Send,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Alert, Card, CardBody } from "@/components/ui/primitives";
import { siteConfig } from "@/config/site";
import { INDIAN_STATES } from "@/data/states";
import { MAX_UPLOAD_FILES } from "@/lib/constants";
import {
  NAME_MAX,
  cleanCity,
  cleanEmail,
  cleanName,
  isValidEmail,
  isValidName,
  isValidPhone,
  phoneInputValue,
} from "@/lib/sanitize";
import { cn } from "@/lib/utils";
import type { PlainService } from "@/types";

type Values = {
  serviceSlug: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  requirement: string;
  purpose: string;
  urgent: boolean;
  consent: boolean;
};

/**
 * One page, not a wizard. Only the name, the mobile number and the consent tick
 * are required — choosing a service is genuinely optional, because plenty of
 * people do not know which document they need until we have spoken to them.
 */
export function RequestForm({
  services,
  initialService = "",
}: {
  services: PlainService[];
  initialService?: string;
}) {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [values, setValues] = useState<Values>({
    serviceSlug: initialService,
    name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    requirement: "",
    purpose: "",
    urgent: false,
    consent: false,
  });

  const selected = useMemo(
    () => services.find((service) => service.slug === values.serviceSlug),
    [services, values.serviceSlug]
  );

  /** Grouped by category so the dropdown stays scannable on a phone. */
  const grouped = useMemo(() => {
    const map = new Map<string, PlainService[]>();
    for (const service of services) {
      const list = map.get(service.category) ?? [];
      list.push(service);
      map.set(service.category, list);
    }
    return Array.from(map.entries());
  }, [services]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  function scrollToTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)].slice(0, MAX_UPLOAD_FILES));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    // The same helpers the API runs, so nothing passes here that fails there.
    const next: Record<string, string> = {};
    if (!isValidName(values.name)) {
      next.name = "Please enter your full name using letters only";
    }
    if (!isValidPhone(values.phone)) {
      next.phone = "Enter a valid 10-digit mobile number";
    }
    if (values.email && !isValidEmail(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (!values.consent) {
      next.consent = "Please accept the terms to continue";
    }
    if (Object.keys(next).length) {
      setErrors(next);
      scrollToTop();
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      body.set("serviceSlug", values.serviceSlug);
      body.set("name", values.name);
      body.set("phone", values.phone);
      body.set("email", values.email);
      body.set("city", values.city);
      body.set("state", values.state);
      body.set("requirement", values.requirement);
      body.set("purpose", values.purpose);
      body.set("urgent", String(values.urgent));
      body.set("consent", String(values.consent));
      body.set("website", "");
      files.forEach((file) => body.append("files", file));

      const response = await fetch("/api/applications", { method: "POST", body });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setErrors(payload.errors ?? {});
        setFormError(
          payload.message ?? "We could not submit your request. Please try again."
        );
        scrollToTop();
        return;
      }

      router.push(`/request/success/${payload.data.trackingId}`);
    } catch {
      setFormError(
        "We could not reach the server. Check your connection and try again, or message us on WhatsApp."
      );
      scrollToTop();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      {formError ? (
        <Alert
          tone="danger"
          className="mb-5"
          icon={<AlertCircle className="h-5 w-5 text-danger-600" />}
        >
          {formError}
        </Alert>
      ) : null}

      <form onSubmit={handleSubmit} noValidate>
        <Card>
          <CardBody className="space-y-5">
            <div>
              <h2 className="text-[18px] font-bold text-navy-900">
                Your details
              </h2>
              <p className="mt-1 text-[14px] text-muted">
                Only your name and mobile number are needed. Everything else is
                optional — we fill in the rest on the call.
              </p>
            </div>

            <Field label="Full name" htmlFor="name" required error={errors.name}>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(event) => set("name", cleanName(event.target.value))}
                maxLength={NAME_MAX}
                placeholder="As written on your Aadhaar"
                invalid={Boolean(errors.name)}
              />
            </Field>

            <Field
              label="Mobile number"
              htmlFor="phone"
              required
              error={errors.phone}
              help="We call and message on this number. No account or password needed."
            >
              <div className="flex">
                <span className="flex items-center rounded-l-xl border border-r-0 border-navy-200 bg-navy-50 px-3.5 text-[15px] font-semibold text-navy-700">
                  +91
                </span>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={12}
                  value={values.phone}
                  onChange={(event) =>
                    set("phone", phoneInputValue(event.target.value))
                  }
                  placeholder="98765 43210"
                  className="rounded-l-none"
                  invalid={Boolean(errors.phone)}
                />
              </div>
            </Field>

            <Field
              label="Which document do you need?"
              htmlFor="serviceSlug"
              hint="Optional"
              error={errors.serviceSlug}
              help="Not sure? Leave it as it is and we will work it out on the call."
            >
              <Select
                id="serviceSlug"
                name="serviceSlug"
                value={values.serviceSlug}
                onChange={(event) => set("serviceSlug", event.target.value)}
                invalid={Boolean(errors.serviceSlug)}
              >
                <option value="">I am not sure yet — please guide me</option>
                {grouped.map(([category, items]) => (
                  <optgroup key={category} label={category}>
                    {items.map((service) => (
                      <option key={service.slug} value={service.slug}>
                        {service.title}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Email"
                htmlFor="email"
                hint="Optional"
                error={errors.email}
              >
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(event) => set("email", cleanEmail(event.target.value))}
                  placeholder="you@example.com"
                  invalid={Boolean(errors.email)}
                />
              </Field>

              <Field label="City / town" htmlFor="city" hint="Optional">
                <Input
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  value={values.city}
                  onChange={(event) => set("city", cleanCity(event.target.value))}
                  placeholder="e.g. Indore"
                />
              </Field>
            </div>

            <Field
              label="State"
              htmlFor="state"
              hint="Optional"
              help="Certificate rules differ by state, so this helps us quote accurately."
              error={errors.state}
            >
              <Select
                id="state"
                name="state"
                value={values.state}
                onChange={(event) => set("state", event.target.value)}
                invalid={Boolean(errors.state)}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="What is it for?"
              htmlFor="purpose"
              hint="Optional"
              help="e.g. college admission, scholarship, government job form"
            >
              <Input
                id="purpose"
                name="purpose"
                value={values.purpose}
                onChange={(event) => set("purpose", event.target.value)}
                placeholder="e.g. B.Sc admission, last date 15 September"
              />
            </Field>

            <Field
              label="Anything we should know?"
              htmlFor="requirement"
              hint="Optional"
            >
              <Textarea
                id="requirement"
                name="requirement"
                value={values.requirement}
                onChange={(event) => set("requirement", event.target.value)}
                placeholder="Describe your situation in your own words. Hindi or English, both are fine."
              />
            </Field>

            {selected?.documentsRequired.length ? (
              <div className="rounded-xl border border-line bg-canvas p-4">
                <p className="text-[13.5px] font-semibold text-navy-900">
                  Documents usually needed for {selected.title}
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {selected.documentsRequired.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-[13px] text-muted"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-600"
                        aria-hidden
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[12.5px] text-muted">
                  Upload them now or send them on WhatsApp later. Both work.
                </p>
              </div>
            ) : null}

            <div>
              <p className="mb-1.5 text-sm font-semibold text-navy-800">
                Upload documents{" "}
                <span className="font-normal text-muted">(optional)</span>
              </p>
              <label
                htmlFor="files"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 bg-canvas px-4 py-7 text-center transition-colors hover:border-brand-400 hover:bg-brand-50"
              >
                <FileUp className="h-6 w-6 text-brand-600" aria-hidden />
                <span className="text-[14px] font-semibold text-navy-900">
                  Tap to add photos or PDFs
                </span>
                <span className="text-[12.5px] text-muted">
                  Up to {MAX_UPLOAD_FILES} files, 4 MB in total. Phone photos
                  are fine — send bigger ones on WhatsApp.
                </span>
                <input
                  id="files"
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(event) => addFiles(event.target.files)}
                />
              </label>

              {files.length ? (
                <ul className="mt-3 space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={`${file.name}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-line bg-white px-3.5 py-2.5"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-medium text-navy-900">
                          {file.name}
                        </span>
                        <span className="block text-[12px] text-muted">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) =>
                            prev.filter((_, position) => position !== index)
                          )
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-danger-600 hover:bg-danger-50"
                        aria-label={`Remove ${file.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => set("urgent", !values.urgent)}
              aria-pressed={values.urgent}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all",
                values.urgent
                  ? "border-warn-500 bg-warn-50"
                  : "border-navy-200 bg-white hover:border-warn-500"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  values.urgent
                    ? "bg-warn-500 text-white"
                    : "bg-navy-100 text-navy-600"
                )}
              >
                <Zap className="h-4.5 w-4.5" aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-navy-900">
                  This is urgent
                </span>
                <span className="block text-[13px] text-muted">
                  We will call you first. Urgent handling may cost extra — we
                  tell you before you pay.
                </span>
              </span>
            </button>

            <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
              <p className="text-[13.5px] font-semibold text-navy-900">
                What happens to the price
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-navy-700">
                Our team reviews your case and calls you with one final price.
                You then pay {siteConfig.advancePercent}% to start, and the
                remaining {siteConfig.balancePercent}% only after your finished
                document is on your tracking page.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas p-4">
              <input
                type="checkbox"
                checked={values.consent}
                onChange={(event) => set("consent", event.target.checked)}
                className="mt-0.5 h-5 w-5 shrink-0 rounded border-navy-300 accent-brand-600"
              />
              <span className="text-[13.5px] leading-relaxed text-navy-700">
                I agree to be contacted on this number by call and WhatsApp
                about my request, and I accept the{" "}
                <Link href="/terms" className="font-semibold text-brand-700 underline">
                  terms
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-brand-700 underline"
                >
                  privacy policy
                </Link>
                .
              </span>
            </label>
            {errors.consent ? (
              <p className="-mt-3 text-[13px] font-medium text-danger-600">
                {errors.consent}
              </p>
            ) : null}
          </CardBody>

          <div className="flex flex-col gap-3 border-t border-line bg-canvas px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
              <ShieldCheck
                className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
                aria-hidden
              />
              Nothing is charged here. We never ask for card, CVV, UPI PIN or
              OTP.
            </p>
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="w-full sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4.5 w-4.5" aria-hidden />
                  Submit request
                </>
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

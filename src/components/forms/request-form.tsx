"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileUp,
  Loader2,
  Search,
  ShieldCheck,
  Trash2,
  Zap,
} from "lucide-react";
import { ServiceIcon } from "@/components/site/service-icon";
import { Button } from "@/components/ui/button";
import {
  ChoiceCard,
  Field,
  Input,
  Select,
  Textarea,
} from "@/components/ui/field";
import { Alert, Badge, Card, CardBody } from "@/components/ui/primitives";
import { INDIAN_STATES } from "@/data/states";
import { MAX_UPLOAD_FILES } from "@/lib/constants";
import { siteConfig } from "@/config/site";
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

const STEPS = ["Service", "Your details", "What you need", "Review"];

export function RequestForm({
  services,
  initialService = "",
}: {
  services: PlainService[];
  initialService?: string;
}) {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(initialService ? 1 : 0);
  const [query, setQuery] = useState("");
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

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return services;
    return services.filter((service) =>
      [service.title, service.category, service.shortDescription, ...service.keywords]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [query, services]);

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

  function validateStep(current: number) {
    const next: Record<string, string> = {};

    if (current === 0 && !values.serviceSlug) {
      next.serviceSlug = "Please choose the document you need";
    }

    if (current === 1) {
      if (values.name.trim().length < 2) next.name = "Please enter your full name";
      const digits = values.phone.replace(/\D/g, "").replace(/^(91|0)/, "");
      if (!/^[6-9]\d{9}$/.test(digits)) {
        next.phone = "Enter a valid 10-digit mobile number";
      }
      if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        next.email = "Enter a valid email address";
      }
    }

    if (current === 3 && !values.consent) {
      next.consent = "Please accept the terms to continue";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    scrollToTop();
  }

  function goBack() {
    setStep((prev) => Math.max(prev - 1, 0));
    scrollToTop();
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    setFiles((prev) => [...prev, ...incoming].slice(0, MAX_UPLOAD_FILES));
  }

  async function handleSubmit() {
    if (!validateStep(3)) return;
    setSubmitting(true);
    setFormError("");

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

      const response = await fetch("/api/applications", {
        method: "POST",
        body,
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setErrors(payload.errors ?? {});
        setFormError(
          payload.message ?? "We could not submit your request. Please try again."
        );
        if (payload.errors?.name || payload.errors?.phone) setStep(1);
        if (payload.errors?.serviceSlug) setStep(0);
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
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-[12.5px] font-semibold text-muted">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-navy-900">{STEPS[step]}</span>
        </div>
        <div className="mt-2 flex gap-1.5" aria-hidden>
          {STEPS.map((label, index) => (
            <span
              key={label}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                index <= step ? "bg-brand-600" : "bg-navy-200"
              )}
            />
          ))}
        </div>
      </div>

      {formError ? (
        <Alert
          tone="danger"
          className="mb-5"
          icon={<AlertCircle className="h-5 w-5 text-danger-600" />}
        >
          {formError}
        </Alert>
      ) : null}

      <Card>
        <CardBody className="space-y-5">
          {/* ------------------------------------------------ Step 1: service */}
          {step === 0 ? (
            <>
              <div>
                <h2 className="text-[18px] font-bold text-navy-900">
                  Which document do you need?
                </h2>
                <p className="mt-1 text-[14px] text-muted">
                  Not sure? Pick the closest one — we will confirm it on the
                  call.
                </p>
              </div>

              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-navy-400"
                  aria-hidden
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search: caste, income, PAN, affidavit..."
                  className="pl-11"
                  aria-label="Search services"
                />
              </div>

              {errors.serviceSlug ? (
                <p className="text-[13px] font-medium text-danger-600">
                  {errors.serviceSlug}
                </p>
              ) : null}

              <div className="grid max-h-[420px] gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                {filtered.map((service) => (
                  <ChoiceCard
                    key={service.slug}
                    checked={values.serviceSlug === service.slug}
                    onSelect={() => set("serviceSlug", service.slug)}
                    title={service.title}
                    subtitle={service.estimatedDays}
                    icon={<ServiceIcon name={service.icon} className="h-4.5 w-4.5" />}
                  />
                ))}
                {!filtered.length ? (
                  <p className="col-span-full rounded-xl border border-dashed border-navy-200 p-6 text-center text-[14px] text-muted">
                    Nothing matched that search. Tell us in your own words on the
                    next step, or{" "}
                    <Link
                      href="/contact"
                      className="font-semibold text-brand-700 underline"
                    >
                      contact us
                    </Link>
                    .
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

          {/* ------------------------------------------------ Step 2: details */}
          {step === 1 ? (
            <>
              <div>
                <h2 className="text-[18px] font-bold text-navy-900">
                  How do we reach you?
                </h2>
                <p className="mt-1 text-[14px] text-muted">
                  We call on this number to confirm your details and the price.
                  No account or password needed.
                </p>
              </div>

              <Field label="Full name" htmlFor="name" required error={errors.name}>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={(event) => set("name", event.target.value)}
                  placeholder="As written on your Aadhaar"
                  invalid={Boolean(errors.name)}
                />
              </Field>

              <Field
                label="Mobile number"
                htmlFor="phone"
                required
                error={errors.phone}
                help="We will also use this number on WhatsApp."
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
                    maxLength={13}
                    value={values.phone}
                    onChange={(event) => set("phone", event.target.value)}
                    placeholder="98765 43210"
                    className="rounded-l-none"
                    invalid={Boolean(errors.phone)}
                  />
                </div>
              </Field>

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
                  onChange={(event) => set("email", event.target.value)}
                  placeholder="you@example.com"
                  invalid={Boolean(errors.email)}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City / town" htmlFor="city" hint="Optional">
                  <Input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={values.city}
                    onChange={(event) => set("city", event.target.value)}
                    placeholder="e.g. Indore"
                  />
                </Field>

                <Field label="State" htmlFor="state" hint="Optional">
                  <Select
                    id="state"
                    name="state"
                    value={values.state}
                    onChange={(event) => set("state", event.target.value)}
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
            </>
          ) : null}

          {/* --------------------------------------------- Step 3: requirement */}
          {step === 2 ? (
            <>
              <div>
                <h2 className="text-[18px] font-bold text-navy-900">
                  Tell us a little more
                </h2>
                <p className="mt-1 text-[14px] text-muted">
                  All optional — it just helps us give you an accurate price on
                  the first call.
                </p>
              </div>

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
                    You can upload them now, or send them on WhatsApp later. Both
                    work.
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
                    Up to {MAX_UPLOAD_FILES} files, 10 MB each. Phone photos are
                    fine.
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
            </>
          ) : null}

          {/* -------------------------------------------------- Step 4: review */}
          {step === 3 ? (
            <>
              <div>
                <h2 className="text-[18px] font-bold text-navy-900">
                  Check and submit
                </h2>
                <p className="mt-1 text-[14px] text-muted">
                  Nothing is charged now. Our team calls you to confirm the price
                  first.
                </p>
              </div>

              <dl className="divide-y divide-line rounded-xl border border-line">
                {[
                  { label: "Service", value: selected?.title ?? "—" },
                  { label: "Name", value: values.name },
                  { label: "Mobile", value: `+91 ${values.phone}` },
                  ...(values.email
                    ? [{ label: "Email", value: values.email }]
                    : []),
                  ...(values.city || values.state
                    ? [
                        {
                          label: "Location",
                          value: [values.city, values.state]
                            .filter(Boolean)
                            .join(", "),
                        },
                      ]
                    : []),
                  ...(values.purpose
                    ? [{ label: "Purpose", value: values.purpose }]
                    : []),
                  ...(files.length
                    ? [{ label: "Files attached", value: `${files.length}` }]
                    : []),
                  {
                    label: "Priority",
                    value: values.urgent ? "Urgent" : "Normal",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-wrap items-start justify-between gap-2 px-4 py-3"
                  >
                    <dt className="text-[13px] font-medium text-muted">
                      {row.label}
                    </dt>
                    <dd className="text-right text-[14px] font-semibold text-navy-900">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-xl border border-brand-200 bg-brand-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[13.5px] font-semibold text-navy-900">
                    What happens to the price
                  </span>
                  <Badge tone="info">Quoted after review</Badge>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-navy-700">
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
                  <Link
                    href="/terms"
                    className="font-semibold text-brand-700 underline"
                  >
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

              <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
                  aria-hidden
                />
                No payment is taken on this website. We never ask for card, CVV,
                UPI PIN or OTP.
              </p>
            </>
          ) : null}
        </CardBody>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 border-t border-line bg-canvas px-5 py-4 sm:px-6">
          {step > 0 ? (
            <Button variant="ghost" onClick={goBack} disabled={submitting}>
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back
            </Button>
          ) : (
            <span />
          )}

          {step < STEPS.length - 1 ? (
            <Button onClick={goNext} size="md">
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={handleSubmit} size="md" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Submitting...
                </>
              ) : (
                <>
                  Submit request
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

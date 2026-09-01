"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
} from "lucide-react";
import { AnchorButton, Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Alert, Card, CardBody } from "@/components/ui/primitives";
import { callLink, siteConfig, whatsappLink } from "@/config/site";
import { CALL_SLOTS, type LeadType } from "@/lib/constants";
import type { PlainService } from "@/types";

type Values = {
  name: string;
  phone: string;
  email: string;
  city: string;
  serviceSlug: string;
  message: string;
  preferredDate: string;
  preferredSlot: string;
  consent: boolean;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function maxDate() {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}

export function LeadForm({
  type,
  heading,
  description,
  services = [],
  withSchedule = false,
  withService = true,
  withMessage = true,
  messageLabel = "Your message",
  messagePlaceholder = "Tell us what you need in your own words.",
  submitLabel = "Submit",
  successTitle = "We have got it",
  successBody = "Our team will call you shortly on the number you gave us.",
}: {
  type: LeadType;
  heading: string;
  description?: string;
  services?: PlainService[];
  withSchedule?: boolean;
  withService?: boolean;
  withMessage?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
  submitLabel?: string;
  successTitle?: string;
  successBody?: string;
}) {
  const [values, setValues] = useState<Values>({
    name: "",
    phone: "",
    email: "",
    city: "",
    serviceSlug: "",
    message: "",
    preferredDate: "",
    preferredSlot: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  }

  const selectedService = services.find(
    (service) => service.slug === values.serviceSlug
  );

  function whatsappHandoff() {
    const lines = [
      `Hello ${siteConfig.name},`,
      type === "DEMO"
        ? "I have booked a demo on your website."
        : type === "CALLBACK"
          ? "I have requested a call back on your website."
          : "I have sent an enquiry on your website.",
      `Name: ${values.name}`,
      selectedService ? `Service: ${selectedService.title}` : "",
      values.preferredDate
        ? `Preferred: ${values.preferredDate} ${values.preferredSlot}`
        : "",
      values.message ? `Details: ${values.message}` : "",
    ].filter(Boolean);
    return whatsappLink(lines.join("\n"));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    const next: Record<string, string> = {};
    if (values.name.trim().length < 2) next.name = "Please enter your full name";
    const digits = values.phone.replace(/\D/g, "").replace(/^(91|0)/, "");
    if (!/^[6-9]\d{9}$/.test(digits)) {
      next.phone = "Enter a valid 10-digit mobile number";
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (withSchedule && !values.preferredDate) {
      next.preferredDate = "Pick a date that suits you";
    }
    if (withSchedule && !values.preferredSlot) {
      next.preferredSlot = "Pick a time window";
    }
    if (!values.consent) next.consent = "Please accept the terms to continue";

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name: values.name,
          phone: values.phone,
          email: values.email,
          city: values.city,
          serviceSlug: values.serviceSlug,
          serviceTitle: selectedService?.title ?? "",
          message: values.message,
          preferredDate: values.preferredDate,
          preferredSlot: values.preferredSlot,
          consent: values.consent,
          website: "",
        }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setErrors(payload.errors ?? {});
        setFormError(
          payload.message ?? "We could not send that. Please try again."
        );
        return;
      }

      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError(
        "We could not reach the server. Please try again, or message us on WhatsApp."
      );
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardBody className="text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
            <CheckCircle2
              className="h-8 w-8 text-success-600"
              strokeWidth={1.8}
              aria-hidden
            />
          </span>
          <h2 className="mt-4 font-display text-[22px] font-extrabold text-navy-900">
            {successTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-[14.5px] leading-relaxed text-muted">
            {successBody}
          </p>

          {values.preferredDate ? (
            <p className="mt-4 inline-flex rounded-xl bg-brand-50 px-4 py-2.5 text-[13.5px] font-semibold text-brand-800">
              {new Date(values.preferredDate).toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              {values.preferredSlot ? `, ${values.preferredSlot}` : ""}
            </p>
          ) : null}

          <div className="mt-6 space-y-2.5">
            <AnchorButton
              href={whatsappHandoff()}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              className="w-full"
            >
              <MessageCircle className="h-4.5 w-4.5" aria-hidden />
              Start the chat on WhatsApp
            </AnchorButton>
            <AnchorButton
              href={callLink}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <Phone className="h-4 w-4" aria-hidden />
              Or call {siteConfig.phoneNumber} now
            </AnchorButton>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <CardBody>
        <h2 className="text-[18px] font-bold text-navy-900">{heading}</h2>
        {description ? (
          <p className="mt-1 text-[14px] leading-relaxed text-muted">
            {description}
          </p>
        ) : null}

        {formError ? (
          <Alert
            tone="danger"
            className="mt-4"
            icon={<AlertCircle className="h-5 w-5 text-danger-600" />}
          >
            {formError}
          </Alert>
        ) : null}

        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <Field label="Full name" htmlFor={`${type}-name`} required error={errors.name}>
            <Input
              id={`${type}-name`}
              autoComplete="name"
              value={values.name}
              onChange={(event) => set("name", event.target.value)}
              placeholder="Your name"
              invalid={Boolean(errors.name)}
            />
          </Field>

          <Field
            label="Mobile number"
            htmlFor={`${type}-phone`}
            required
            error={errors.phone}
            help="We call and message on this number."
          >
            <div className="flex">
              <span className="flex items-center rounded-l-xl border border-r-0 border-navy-200 bg-navy-50 px-3.5 text-[15px] font-semibold text-navy-700">
                +91
              </span>
              <Input
                id={`${type}-phone`}
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

          {withService && services.length ? (
            <Field label="Which service?" htmlFor={`${type}-service`} hint="Optional">
              <Select
                id={`${type}-service`}
                value={values.serviceSlug}
                onChange={(event) => set("serviceSlug", event.target.value)}
              >
                <option value="">Not sure yet</option>
                {services.map((service) => (
                  <option key={service.slug} value={service.slug}>
                    {service.title}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          {withSchedule ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Preferred date"
                htmlFor={`${type}-date`}
                required
                error={errors.preferredDate}
              >
                <Input
                  id={`${type}-date`}
                  type="date"
                  min={today()}
                  max={maxDate()}
                  value={values.preferredDate}
                  onChange={(event) => set("preferredDate", event.target.value)}
                  invalid={Boolean(errors.preferredDate)}
                />
              </Field>
              <Field
                label="Time window"
                htmlFor={`${type}-slot`}
                required
                error={errors.preferredSlot}
              >
                <Select
                  id={`${type}-slot`}
                  value={values.preferredSlot}
                  onChange={(event) => set("preferredSlot", event.target.value)}
                  invalid={Boolean(errors.preferredSlot)}
                >
                  <option value="">Select a time</option>
                  {CALL_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" htmlFor={`${type}-city`} hint="Optional">
              <Input
                id={`${type}-city`}
                autoComplete="address-level2"
                value={values.city}
                onChange={(event) => set("city", event.target.value)}
                placeholder="e.g. Indore"
              />
            </Field>
            <Field
              label="Email"
              htmlFor={`${type}-email`}
              hint="Optional"
              error={errors.email}
            >
              <Input
                id={`${type}-email`}
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(event) => set("email", event.target.value)}
                placeholder="you@example.com"
                invalid={Boolean(errors.email)}
              />
            </Field>
          </div>

          {withMessage ? (
            <Field label={messageLabel} htmlFor={`${type}-message`} hint="Optional">
              <Textarea
                id={`${type}-message`}
                value={values.message}
                onChange={(event) => set("message", event.target.value)}
                placeholder={messagePlaceholder}
              />
            </Field>
          ) : null}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line bg-canvas p-4">
            <input
              type="checkbox"
              checked={values.consent}
              onChange={(event) => set("consent", event.target.checked)}
              className="mt-0.5 h-5 w-5 shrink-0 rounded border-navy-300 accent-brand-600"
            />
            <span className="text-[13.5px] leading-relaxed text-navy-700">
              I agree to be contacted on this number by call and WhatsApp, and I
              accept the{" "}
              <Link href="/privacy" className="font-semibold text-brand-700 underline">
                privacy policy
              </Link>
              .
            </span>
          </label>
          {errors.consent ? (
            <p className="-mt-2 text-[13px] font-medium text-danger-600">
              {errors.consent}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4.5 w-4.5" aria-hidden />
                {submitLabel}
              </>
            )}
          </Button>

          <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-muted">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-success-600"
              aria-hidden
            />
            No payment is taken on this website, and we never ask for card, CVV,
            UPI PIN or OTP.
          </p>
        </form>
      </CardBody>
    </Card>
  );
}

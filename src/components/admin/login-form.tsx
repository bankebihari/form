"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert, Card, CardBody } from "@/components/ui/primitives";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        setError(payload.message ?? "Could not sign you in.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="shadow-lift">
      <CardBody>
        <h1 className="text-[19px] font-bold text-navy-900">Sign in</h1>
        <p className="mt-1 text-[13.5px] text-muted">
          Use the account created when the site was set up.
        </p>

        {error ? (
          <Alert
            tone="danger"
            className="mt-4"
            icon={<AlertCircle className="h-5 w-5 text-danger-600" />}
          >
            {error}
          </Alert>
        ) : null}

        <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
          <Field label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>

          <Field label="Password" htmlFor="password" required>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Your password"
                className="pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-navy-500 hover:bg-navy-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4.5 w-4.5" aria-hidden />
                ) : (
                  <Eye className="h-4.5 w-4.5" aria-hidden />
                )}
              </button>
            </div>
          </Field>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" aria-hidden />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="h-4.5 w-4.5" aria-hidden />
                Sign in
              </>
            )}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertTriangle, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { changePasswordAction, type ActionState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { Alert, Card, CardBody, CardHeader } from "@/components/ui/primitives";

const idle: ActionState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Changing...
        </>
      ) : (
        <>
          <KeyRound className="h-4 w-4" aria-hidden />
          Change password
        </>
      )}
    </Button>
  );
}

export function PasswordForm() {
  const [state, action] = useActionState(changePasswordAction, idle);

  return (
    <Card>
      <CardHeader
        title="Change your password"
        subtitle="Changing it signs out every device, including this one."
      />
      <CardBody>
        <form action={action} className="max-w-md space-y-4">
          <Field label="Current password" htmlFor="currentPassword" required>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
            />
          </Field>

          <Field
            label="New password"
            htmlFor="newPassword"
            required
            help="At least 10 characters, with an uppercase letter, a lowercase letter and a number."
          >
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </Field>

          <Field label="Confirm new password" htmlFor="confirmPassword" required>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </Field>

          <SubmitButton />
        </form>

        {state.message ? (
          <Alert
            tone={state.ok ? "success" : "danger"}
            className="mt-4 max-w-md"
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

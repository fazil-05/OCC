"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Building2,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { PremiumButton } from "@/components/ui/PremiumButton";
import { PremiumInput } from "@/components/ui/PremiumInput";
import { registerSchema, type RegisterInput } from "@/lib/validations";

const colleges = [
  "Delhi University",
  "PES University",
  "RV College",
  "BMS College",
  "PESIT",
  "Christ University",
  "Jain University",
  "Ramaiah Institute",
  "BMSCE",
  "NIE Mysore",
];

const ease = [0.25, 0.46, 0.45, 0.94] as const;

function passwordStrength(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password) && /\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;

  const labels = ["Weak", "Fair", "Good", "Strong"];
  const colors = ["#FF4D4D", "#FF8B3D", "#E7C65F", "#00E87A"];
  return {
    score,
    label: labels[Math.max(0, score - 1)] ?? "Weak",
    color: colors[Math.max(0, score - 1)] ?? colors[0],
  };
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [collegeQuery, setCollegeQuery] = React.useState("");

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      collegeName: "",
      phoneNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptedTerms: false,
    },
  });

  const passwordValue = form.watch("password");
  const confirmPasswordValue = form.watch("confirmPassword");
  const collegeName = form.watch("collegeName");

  const suggestedColleges = React.useMemo(() => {
    const query = (collegeQuery || collegeName || "").toLowerCase();
    if (!query) return colleges;
    return colleges.filter((college) => college.toLowerCase().includes(query));
  }, [collegeName, collegeQuery]);

  const strength = passwordStrength(passwordValue ?? "");
  const passwordsMatch =
    !!confirmPasswordValue && !!passwordValue && passwordValue === confirmPasswordValue;

  async function onSubmit(values: RegisterInput) {
    setServerError(null);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setServerError(data?.error ?? "Registration failed.");
      return;
    }

    const redirectTarget = searchParams.get("redirect");
    const redirectQuery = redirectTarget
      ? `&redirect=${encodeURIComponent(redirectTarget)}`
      : "";
    router.push(
      `/login?email=${encodeURIComponent(values.email)}${redirectQuery}`,
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.5em] text-[#C9A96E]">Join OCC</p>
        <div className="leading-none">
          <h1 className="font-headline text-5xl text-[#F5F0E8] md:text-[48px]">Create Your</h1>
          <p className="font-accent text-4xl text-[#C9A96E] md:text-[44px]">Account.</p>
        </div>
        <p className="max-w-md text-sm text-[#8A8478]">
          Connect with clubs across Bangalore colleges.
        </p>
      </div>

      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        {[
          {
            key: "fullName",
            render: (
              <PremiumInput
                label="Full Name"
                icon={User}
                placeholder="Aarav Sharma"
                error={form.formState.errors.fullName?.message}
                isValid={!!form.getFieldState("fullName").isDirty && !form.formState.errors.fullName}
                {...form.register("fullName")}
              />
            ),
          },
          {
            key: "collegeName",
            render: (
              <PremiumInput
                label="College Name"
                icon={Building2}
                placeholder="Delhi University"
                value={collegeName}
                suggestions={suggestedColleges}
                onSuggestionSelect={(value) => {
                  form.setValue("collegeName", value, { shouldDirty: true, shouldValidate: true });
                  setCollegeQuery(value);
                }}
                onChange={(event) => {
                  form.setValue("collegeName", event.target.value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                  setCollegeQuery(event.target.value);
                }}
                error={form.formState.errors.collegeName?.message}
                isValid={
                  !!form.getFieldState("collegeName").isDirty &&
                  !form.formState.errors.collegeName
                }
              />
            ),
          },
          {
            key: "phoneNumber",
            render: (
              <PremiumInput
                label="Phone Number"
                icon={Phone}
                placeholder="98765 43210"
                prefix="+91"
                error={form.formState.errors.phoneNumber?.message}
                isValid={
                  !!form.getFieldState("phoneNumber").isDirty &&
                  !form.formState.errors.phoneNumber
                }
                {...form.register("phoneNumber")}
              />
            ),
          },
          {
            key: "email",
            render: (
              <PremiumInput
                label="Email Address"
                icon={Mail}
                placeholder="aarav@email.com"
                error={form.formState.errors.email?.message}
                isValid={!!form.getFieldState("email").isDirty && !form.formState.errors.email}
                {...form.register("email")}
              />
            ),
          },
          {
            key: "password",
            render: (
              <div className="space-y-3">
                <PremiumInput
                  label="Password"
                  icon={Lock}
                  placeholder="••••••••••••••••"
                  type={showPassword ? "text" : "password"}
                  error={form.formState.errors.password?.message}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-[#8A8478] transition hover:text-[#F5F0E8]"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                  {...form.register("password")}
                />
                <div className="space-y-2">
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-1.5 rounded-full"
                        style={{
                          background:
                            index < strength.score ? strength.color : "rgba(255,248,235,0.12)",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#8A8478]">
                    Password strength:{" "}
                    <span style={{ color: strength.color }}>{passwordValue ? strength.label : "Weak"}</span>
                  </p>
                </div>
              </div>
            ),
          },
          {
            key: "confirmPassword",
            render: (
              <PremiumInput
                label="Confirm Password"
                icon={Lock}
                placeholder="Repeat your password"
                type={showConfirmPassword ? "text" : "password"}
                error={form.formState.errors.confirmPassword?.message}
                isValid={passwordsMatch}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="text-[#8A8478] transition hover:text-[#F5F0E8]"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                {...form.register("confirmPassword")}
              />
            ),
          },
        ].map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease }}
          >
            {field.render}
          </motion.div>
        ))}

        <motion.label
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease }}
          className="flex items-start gap-3 text-sm text-[#8A8478]"
        >
          <button
            type="button"
            onClick={() =>
              form.setValue("acceptedTerms", !form.getValues("acceptedTerms"), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${
              form.getValues("acceptedTerms")
                ? "border-[#C9A96E] bg-[#C9A96E]/15 text-[#C9A96E]"
                : "border-white/15"
            }`}
          >
            {form.getValues("acceptedTerms") ? <Check className="h-3.5 w-3.5" /> : null}
          </button>
          <input type="checkbox" className="hidden" {...form.register("acceptedTerms")} />
          <span>
            I agree to the Terms of Service and Privacy Policy
            {form.formState.errors.acceptedTerms ? (
              <span className="block pt-1 text-xs text-[#FF4D4D]">
                {form.formState.errors.acceptedTerms.message}
              </span>
            ) : null}
          </span>
        </motion.label>

        {serverError ? <p className="text-sm text-[#FF4D4D]">{serverError}</p> : null}

        <PremiumButton type="submit" loading={form.formState.isSubmitting} loadingLabel="CREATING ACCOUNT...">
          CREATE ACCOUNT
        </PremiumButton>

        <p className="text-sm text-[#8A8478]">
          Already have an account?{" "}
          <Link className="text-[#C9A96E] transition hover:underline" href="/login">
            Sign in →
          </Link>
        </p>
      </form>
    </div>
  );
}

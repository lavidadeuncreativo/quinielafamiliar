import { redirect } from "next/navigation";
import { LogIn } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

interface LoginPageProps {
  searchParams?: Promise<{ reason?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const reason = params?.reason;

  return (
    <main className="page-shell grid min-h-[70vh] place-items-center">
      <section className="panel w-full max-w-md p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700/80">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Iniciar sesión</h1>
        {reason ? (
          <p className="mt-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            {messageForReason(reason)}
          </p>
        ) : null}
        <form action={loginAction} className="mt-6 grid gap-4">
          <label>
            <span className="field-label">Correo</span>
            <input className="field-input" name="email" type="email" autoComplete="email" required />
          </label>
          <label>
            <span className="field-label">Contraseña</span>
            <input
              className="field-input"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </label>
          <button className="btn-primary" type="submit">
            <LogIn aria-hidden="true" className="size-4" />
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}

async function loginAction(formData: FormData) {
  "use server";

  if (!isSupabaseConfigured()) {
    redirect("/admin/login?reason=missing-env");
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/admin/login?reason=invalid");
  }

  redirect("/admin");
}

function messageForReason(reason: string) {
  const messages: Record<string, string> = {
    "missing-env": "Configura las variables de Supabase antes de usar el panel administrativo.",
    "session-required": "La sesión administrativa es obligatoria.",
    "admin-required": "El usuario autenticado no tiene rol admin.",
    invalid: "Correo o contraseña inválidos."
  };

  return messages[reason] ?? "No se pudo abrir el panel administrativo.";
}

import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { updateSession } from "@/lib/supabase/middleware";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return response;
  }

  const { url, anonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured || !url || !anonKey) {
    return redirectToLogin(request, "missing-env");
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll() {
        return undefined;
      }
    }
  });
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectToLogin(request, "session-required");
  }

  return response;
}

function redirectToLogin(request: NextRequest, reason: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("reason", reason);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};

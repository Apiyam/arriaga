import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/utility";

export const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const redirectAfterAuth = () => {
    const redirect = params.get("redirect");
    if (redirect) {
      navigate(decodeURIComponent(redirect), { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim() || !password) {
      setFormError("Completa el correo y la contraseña.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) {
          setFormError(error.message || "Credenciales incorrectas.");
          return;
        }
      } else {
        const { error } = await supabaseClient.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (error) {
          setFormError(error.message || "No se pudo crear la cuenta.");
          return;
        }
      }
      redirectAfterAuth();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1517430816045-df4b7de1c5f6?crop=entropy&cs=tinysrgb&fit=max&ixid=M3wzNjI1NXwwfDF8c2VhY3x8fHx8fHx8fHwxNjg0MjczMTc5&ixlib=rb-1.2.1&q=80&w=1080')`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-0" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="bg-white/90 rounded-lg shadow-xl p-8 max-w-md w-full backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            {isLogin ? "Iniciar sesión" : "Crear cuenta"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
              />
            </div>
            {formError && (
              <p className="text-sm text-red-600" role="alert">
                {formError}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Procesando..." : isLogin ? "Entrar" : "Registrarse"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            {isLogin ? (
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium border-none bg-transparent cursor-pointer p-0"
                  onClick={() => {
                    setIsLogin(false);
                    setFormError(null);
                  }}
                >
                  Registrarse
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline font-medium border-none bg-transparent cursor-pointer p-0"
                  onClick={() => {
                    setIsLogin(true);
                    setFormError(null);
                  }}
                >
                  Iniciar sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

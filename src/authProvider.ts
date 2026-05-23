import { AuthBindings } from "@refinedev/core";

import { supabaseClient } from "./utility";

const authProvider: AuthBindings = {
  login: async ({ email, password, providerName }) => {
    try {
      if (providerName) {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: providerName,
        });

        if (error) {
          return {
            success: false,
            error: new Error(error.message || "No se pudo iniciar sesión con el proveedor"),
          };
        }

        if (data?.url) {
          return {
            success: true,
            redirectTo: "/",
          };
        }
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: new Error(error.message || "Credenciales incorrectas"),
        };
      }

      if (data?.user) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Error de inicio de sesión"),
      };
    }

    return {
      success: false,
      error: new Error("Correo o contraseña no válidos"),
    };
  },
  register: async ({ email, password }) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error: new Error(error.message || "No se pudo registrar la cuenta"),
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Error de registro"),
      };
    }

    return {
      success: false,
      error: new Error("No se pudo completar el registro"),
    };
  },
  forgotPassword: async ({ email }) => {
    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        return {
          success: false,
          error: new Error(error.message || "No se pudo enviar el correo"),
        };
      }

      if (data) {
        return {
          success: true,
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Error al recuperar contraseña"),
      };
    }

    return {
      success: false,
      error: new Error("Correo no válido"),
    };
  },
  updatePassword: async ({ password }) => {
    try {
      const { data, error } = await supabaseClient.auth.updateUser({
        password,
      });

      if (error) {
        return {
          success: false,
          error: new Error(error.message || "No se pudo actualizar la contraseña"),
        };
      }

      if (data) {
        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error("Error al actualizar contraseña"),
      };
    }
    return {
      success: false,
      error: new Error("Contraseña no válida"),
    };
  },
  logout: async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error: new Error(error.message || "No se pudo cerrar sesión"),
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
  check: async () => {
    try {
      const { data } = await supabaseClient.auth.getSession();
      const { session } = data;

      if (!session) {
        return {
          authenticated: false,
          redirectTo: "/login",
          logout: true,
          error: new Error("Sesión no encontrada"),
        };
      }
    } catch (error: unknown) {
      return {
        authenticated: false,
        error: error instanceof Error ? error : new Error("No autenticado"),
        logout: true,
        redirectTo: "/login",
      };
    }

    return {
      authenticated: true,
    };
  },
  getPermissions: async () => {
    const { data } = await supabaseClient.auth.getUser();
    return data.user?.role ?? null;
  },
  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();

    if (data?.user) {
      const meta = data.user.user_metadata as Record<string, string> | undefined;
      const name =
        meta?.full_name ||
        meta?.name ||
        data.user.email ||
        data.user.id;

      return {
        ...data.user,
        id: data.user.id,
        name,
        avatar: meta?.avatar_url,
      };
    }

    return null;
  },
};

export default authProvider;

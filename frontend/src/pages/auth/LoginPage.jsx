import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LogIn } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useAuth from "@/hooks/useAuth";
import PasswordInput from "@/components/forms/PasswordInput";

const LoginPage = () => {
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");

      await login(data);
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to login. Please check your email and password.",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="text-xl font-bold tracking-tight text-text">
            Syn<span className="text-primary">Sphere</span>
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-button px-4 py-2 text-sm font-medium text-primary"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-button bg-primary px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-primary-hover"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-text">
                Login into account
              </h1>

              <p className="mt-2 text-sm text-text-secondary">
                Welcome back to SynSphere.
              </p>
            </div>

            <Link
              to="/register"
              className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Sign up instead
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              error={errors.email?.message}
            />

            <PasswordInput
                id="password"
                label="Password"
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password", {
                    required: "Password is required",
                })}
                error={errors.password?.message}
            />

            

            {serverError && (
              <div
                role="alert"
                className="rounded-input border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
              >
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              loading={isSubmitting}
              leftIcon={LogIn}
            >
              Login
            </Button>
          </form>
        </div>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© 2026 SynSphere. Built for better collaboration.</p>

          <div className="flex gap-6">
            <span>Quick Links</span>
            <span>Company</span>
            <span>Connect</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
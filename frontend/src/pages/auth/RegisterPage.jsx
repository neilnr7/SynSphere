import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useAuth from "@/hooks/useAuth";
import PasswordInput from "@/components/forms/PasswordInput";

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setServerError("");

      const userData = {
        name: `${data.firstName.trim()} ${data.lastName.trim()}`.trim(),
        email: data.email,
        password: data.password,
      };

      await registerUser(userData);
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
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
              className="rounded-button px-4 py-2 text-sm font-medium text-text-secondary transition-colors hover:text-text"
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
                Create an account
              </h1>

              <p className="mt-2 text-sm text-text-secondary">
                Start collaborating with your team.
              </p>
            </div>

            <Link
              to="/login"
              className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Log in instead
            </Link>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="firstName"
              label="First name"
              type="text"
              placeholder="First Name"
              autoComplete="given-name"
              {...register("firstName", {
                required: "First name is required",
              })}
              error={errors.firstName?.message}
            />

            <Input
              id="lastName"
              label="Last name"
              type="text"
              placeholder="Last Name"
              autoComplete="family-name"
              {...register("lastName", {
                required: "Last name is required",
              })}
              error={errors.lastName?.message}
            />

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
                placeholder="Create a password"
                autoComplete="new-password"
                {...register("password", {
                    required: "Password is required",
                    minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                    },
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
              leftIcon={UserPlus}
            >
              Create an account
            </Button>
          </form>
        </div>
      </main>

      <footer className="border-t border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-8 md:grid-cols-[1.5fr_2fr] lg:px-8">
          <div className="rounded-card border border-border bg-surface-secondary p-6">
            <h2 className="text-lg font-semibold text-text">
              SynSphere
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-text-secondary">
              Plan projects, manage tasks, and keep your team moving together.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-sm">
            <div>
              <p className="font-medium text-text">Quick Links</p>
              <div className="mt-3 space-y-2 text-text-muted">
                <p>Projects</p>
                <p>Tasks</p>
                <p>Analytics</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-text">Company</p>
              <div className="mt-3 space-y-2 text-text-muted">
                <p>About</p>
                <p>Privacy</p>
                <p>Terms</p>
              </div>
            </div>

            <div>
              <p className="font-medium text-text">Connect</p>
              <div className="mt-3 space-y-2 text-text-muted">
                <p>GitHub</p>
                <p>LinkedIn</p>
                <p>Contact</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
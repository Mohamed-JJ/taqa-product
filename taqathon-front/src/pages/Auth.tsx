"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/(zustand)/useAuthStore";
import { toast } from "sonner";
import { registerSchema, type Login, type Register } from "@/types/user.types";
import { loginSchema } from "@/types/user.types";
import { Eye, EyeOff, User, Mail, Lock, Building2 } from "lucide-react";
import taqaLogo from "@/assets/taqa-logo.svg";
import { useNavigate } from "react-router-dom";

const Error = ({ text }) => {
  return (
    <div className="min-h-[17px]">
      {text.length !== 0 && (
        <p className="text-red-500 text-xs animate-fade-in">{text}</p>
      )}
    </div>
  );
};

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [signIn, setSignIn] = useState<Login>({
    userName: "",
    passWord: "",
  });

  const [loginInput, setLoginInput] = useState<Register>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    passWord: "",
    sec_password: "",
  });

  const [loginError, setLoginError] = useState<Login | null>(null);
  const [registerError, setRegisterError] = useState<Register | null>(null);

  const { login, register, user } = useAuthStore();

  const handleSignIn = async () => {
    setIsLoading(true);
    setLoginError(null);
    setRegisterError(null);

    try {
      const loginValidation = loginSchema.safeParse(signIn);
      if (!loginValidation.success) {
        const errors = loginValidation.error.formErrors.fieldErrors;
        setLoginError({
          userName: errors.userName ? errors.userName[0] : null,
          passWord: errors.passWord ? errors.passWord[0] : null,
        });
        return;
      } else {
        setLoginError(null);
        const res = await login({
          userName: signIn.userName,
          passWord: signIn.passWord,
        });
        toast(
          res
            ? "Welcome back! You will be redirected shortly."
            : "Invalid credentials. Please check your username and password.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setLoginError(null);
    setRegisterError(null);

    try {
      const registerValidation = registerSchema.safeParse(loginInput);
      if (!registerValidation.success) {
        const errors = registerValidation.error.formErrors.fieldErrors;
        setRegisterError({
          firstName: errors.firstName ? errors.firstName[0] : null,
          lastName: errors.lastName ? errors.lastName[0] : null,
          userName: errors.userName ? errors.userName[0] : null,
          email: errors.email ? errors.email[0] : null,
          passWord: errors.passWord ? errors.passWord[0] : null,
          sec_password: errors.sec_password ? errors.sec_password[0] : null,
        });
        return;
      } else {
        setRegisterError(null);
        const res = await register(loginInput);
        if (res) {
          setLogin(true);
          toast.success(
            "Registration successful! Please sign in with your new account.",
          );
        } else {
          toast.error("Registration failed. Please try again.");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setLoginError(null);
    setRegisterError(null);
    if (!user) return;
    if ("redirectUrl" in user && typeof user.redirectUrl === "string") {
      // alert(user.redirectUrl);
      window.location.href = user.redirectUrl;
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-6 pb-8">
            {/* TAQA Logo */}
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-gradient-to-br from-[#003D55] to-[#0066CC] rounded-2xl shadow-lg">
                <img
                  src={taqaLogo}
                  alt="TAQA Logo"
                  className="h-12 w-auto filter brightness-0 invert"
                />
              </div>
            </div>

            {/* Title and Description */}
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isLogin ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isLogin
                  ? "Sign in to access your TAQA maintenance dashboard"
                  : "Join TAQA's industrial maintenance platform"}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {!isLogin ? (
              /* Register Form */
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="First Name"
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={loginInput.firstName}
                        onChange={(e) =>
                          setLoginInput({
                            ...loginInput,
                            firstName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Error text={registerError?.firstName || ""} />
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        value={loginInput.lastName}
                        onChange={(e) =>
                          setLoginInput({
                            ...loginInput,
                            lastName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <Error text={registerError?.lastName || ""} />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      value={loginInput.email}
                      onChange={(e) =>
                        setLoginInput({ ...loginInput, email: e.target.value })
                      }
                    />
                  </div>
                  <Error text={registerError?.email || ""} />
                </div>

                {/* Username Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Username"
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      value={loginInput.userName}
                      onChange={(e) =>
                        setLoginInput({
                          ...loginInput,
                          userName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Error text={registerError?.userName || ""} />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      value={loginInput.passWord}
                      onChange={(e) =>
                        setLoginInput({
                          ...loginInput,
                          passWord: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Error text={registerError?.passWord || ""} />
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      value={loginInput.sec_password}
                      onChange={(e) =>
                        setLoginInput({
                          ...loginInput,
                          sec_password: e.target.value,
                        })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Error text={registerError?.sec_password || ""} />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#003D55] to-[#0066CC] hover:from-[#002A3D] hover:to-[#0052A3] text-white font-medium py-2.5 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            ) : (
              /* Login Form */
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSignIn();
                }}
              >
                {/* Username Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Username"
                      className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      value={signIn.userName}
                      onChange={(e) =>
                        setSignIn({ ...signIn, userName: e.target.value })
                      }
                    />
                  </div>
                  <Error text={loginError?.userName || ""} />
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                      value={signIn.passWord}
                      onChange={(e) =>
                        setSignIn({ ...signIn, passWord: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Error text={loginError?.passWord || ""} />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#003D55] to-[#0066CC] hover:from-[#002A3D] hover:to-[#0052A3] text-white font-medium py-2.5 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            )}

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* Switch Form Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  className="ml-1 font-medium text-[#003D55] hover:text-[#0066CC] underline underline-offset-4"
                  onClick={() => setLogin(!isLogin)}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            © 2024 TAQA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

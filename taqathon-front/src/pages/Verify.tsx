"use client";
// import {
//   usePathname,
//   useRouter,
//   useSearchParams,
// } from 'next/navigation';
import { Spinner } from "../components/ui/spinner";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const Verify = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get("accessToken");
        const user_id = searchParams.get("uid");
        const user_name = searchParams.get("uname");
        // Validate required parameters
        if (!token || !user_id || !user_name) {
          throw new Error("Missing required authentication parameters");
        }
        // Set token and user info in storage
        localStorage.setItem("access_token", token);
        localStorage.setItem("uid", user_id);
        localStorage.setItem("userName", user_name);
        // Add a small delay to show loading state (optional)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        // Authentication successful, redirect to dashboard
        navigate("/");
      } catch (error: unknown) {
        console.error("Authentication error:", error);
        setError(
          error instanceof Error ? error.message : "Authentication failed",
        );
        setIsLoading(false);
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/?error=auth_failed");
        }, 2000);
      }
    };

    handleAuthentication();
  }, [searchParams, navigate]);

  // Show error state
  if (error) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="text-red-500 text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  // This should rarely be reached as we redirect on success
  return null;
};

export default Verify;
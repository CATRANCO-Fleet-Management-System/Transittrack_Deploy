"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image from next/image
import LoadingSpinner from "./components/loadingAnimations";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        {/* Logo */}
        <div className="-mt-20">
          <Image
            src="/logo.png" // Replace with your logo file path
            alt="Logo"
            width={480} // Specify width in pixels
            height={320} // Specify height in pixels
            className="mx-auto"
            priority // Ensures the image is loaded immediately
          />
        </div>

        {/* Loading Animation */}
        <div className="loadingcontainer -mt-20">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  );
}

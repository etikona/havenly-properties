// app/global-error.tsx
"use client";

import Link from "next/link";
import { Building2, Home, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            {/* Error Illustration */}
            <div className="relative mb-8">
              <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-16 h-16 text-amber-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                !
              </div>
            </div>

            {/* Error Message */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Something Went Wrong
            </h1>

            <div className="w-16 h-1 bg-linear-to-r from-amber-500 to-amber-600 mx-auto mb-4 rounded-full" />

            <p className="text-gray-600 mb-6">
              We are experiencing technical difficulties. Our team has been
              notified and is working on a fix.
            </p>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-800 text-sm font-mono break-all">
                  {error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </div>

            {/* Support Contact */}
            <div className="mt-8 text-sm text-gray-500">
              <p>
                Need immediate assistance?{" "}
                <a
                  href="tel:+8801700000000"
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Call us
                </a>{" "}
                or{" "}
                <Link
                  href="/contact"
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  send a message
                </Link>
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

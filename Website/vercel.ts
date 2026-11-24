const backend = process.env.JAVA_API_URL?.replace(/\/+$/, "");

if (!backend || !/^https:\/\/[^/?#]+$/.test(backend)) {
  throw new Error("Set JAVA_API_URL to the public HTTPS origin of the CloFit Java backend.");
}

export const config = {
  framework: "vite",
  buildCommand: "npm run build",
  outputDirectory: "dist",
  rewrites: [
    { source: "/api/:path*", destination: backend + "/api/:path*" },
    { source: "/health", destination: backend + "/health" },
    { source: "/:path((?!api/|assets/|images/|uploads/|.*\\.[^/]+$).*)", destination: "/index.html" },
  ],
};

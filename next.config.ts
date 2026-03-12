import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    compiler: {},
    // Mongoose/MongoDB fora do bundle (evita panic no servidor)
    serverExternalPackages: ["mongoose", "mongodb"],
    experimental: {
        serverActions: {
            bodySizeLimit: "10mb",
        },
    },
};

export default nextConfig;

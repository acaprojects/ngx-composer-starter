const PROXY_CONFIG = [
    {
        context: [
            "/control",
            "/auth",
            "/app_api",
        ],
        target: "http://localhost:8888",
        secure: false,
        changeOrigin: true
    }
]

module.exports = PROXY_CONFIG;
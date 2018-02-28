const PROXY_CONFIG = [
    {
        context: [
            "/control",
            "/auth",
            "/app_api",
            "/login",
            "/backoffice"
        ],
        target: "http://localhost:8888",
        secure: false,
        changeOrigin: true
    },
    {
        context: [
            "/control/websocket",
        ],
        target: "ws://localhost:8888",
        secure: false,
        changeOrigin: true,
        ws: true
    }
];

module.exports = PROXY_CONFIG;

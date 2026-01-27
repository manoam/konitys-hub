const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('[Proxy] Setting up proxy for /api/admin -> http://auth.konitys.fr/admin/realms/konitys');

  app.use(
    '/api/admin',
    createProxyMiddleware({
      target: 'http://auth.konitys.fr',
      changeOrigin: true,
      pathRewrite: {
        '^/api/admin': '/admin/realms/konitys',
      },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('[Proxy] Request:', req.method, req.url, '-> http://auth.konitys.fr/admin/realms/konitys' + req.url.replace('/api/admin', ''));
      },
      onError: (err, req, res) => {
        console.error('[Proxy] Error:', err.message);
      },
    })
  );
};

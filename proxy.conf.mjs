export default [
  {
    context: [
      '/api/public/v1',
    ],
    target: "http://localhost:8000",
    secure: false,
    changeOrigin: true
  }
];

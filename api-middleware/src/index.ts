import app, { CACHE_TTL } from "./app";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Middleware API running on port ${PORT}`);
  console.log(`Cache TTL: ${CACHE_TTL / 1000}s`);
});

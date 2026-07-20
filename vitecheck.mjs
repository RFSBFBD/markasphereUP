import { createServer } from "vite";
const server = await createServer({ configFile: "./vite.config.js", server: { port: 5199 }, logLevel: "error" });
await server.listen();
const port = server.config.server.port;
const urls = ["/", "/src/views/PortfolioView.vue", "/src/views/BlogView.vue", "/src/views/BlogDetailView.vue", "/src/components/blog/BlogCard.vue", "/src/data/site/testimonials.js", "/src/services/BlogService.js", "/src/data/portfolio/projects/publicService.js", "/src/router/index.js"];
for (const u of urls) {
  try {
    const r = await fetch("http://localhost:" + port + u);
    console.log(u + " -> " + r.status);
  } catch (e) { console.log(u + " -> ERR " + e.message); }
}
await server.close();
console.log("DONE");

export default {
    dialect: "sqlite",
    driver: "d1-http",
    out: "drizzle/migrations",
    schema: "src/db/schema.ts",
    dbCredentials: {
        url: '/mnt/tejus_data/projects/theTire3CheckList/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/cd8d9a5a3909165434def5b22583b2f801248823d6320f75b7e3991ae34212e8.sqlite'                   // path to your local SQLite DB
    }
};
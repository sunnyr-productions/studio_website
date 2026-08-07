/**
 * Emits a JSON-LD `<script>` for search engines. This is data, not executable
 * JS — the standard Next.js pattern for structured data. Pass one schema object
 * or an array of them.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is trusted, build-time content (no user input), so
      // serializing it directly is safe. `<` is escaped to avoid any chance of
      // breaking out of the script element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

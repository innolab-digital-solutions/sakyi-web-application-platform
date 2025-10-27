interface BlogDetailContentProperties {
  content: string;
}

export default function BlogDetailContent({ content }: BlogDetailContentProperties) {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:tracking-tight prose-h1:text-3xl prose-h1:leading-tight prose-h2:text-2xl prose-h2:leading-tight prose-h3:text-xl prose-h3:leading-tight prose-p:text-slate-600 prose-p:leading-relaxed prose-a:text-[#35bec5] prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-ul:text-slate-600 prose-ol:text-slate-600 prose-li:text-slate-600 prose-li:leading-relaxed prose-blockquote:border-l-[#35bec5] prose-blockquote:bg-slate-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:text-slate-700 prose-blockquote:italic"
          style={{ fontFamily: "Inter, sans-serif" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}

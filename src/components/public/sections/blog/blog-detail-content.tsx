interface BlogDetailContentProperties {
  content: string;
}

export default function BlogDetailContent({ content }: BlogDetailContentProperties) {
  return (
    <section className="relative overflow-hidden bg-white py-16">
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-none text-base leading-relaxed text-slate-700
          [&_h1]:mb-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-slate-900 [&_h1]:tracking-tight
          [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-slate-900 [&_h2]:tracking-tight
          [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900
          [&_p]:mb-4 [&_p]:text-slate-600 [&_p]:leading-relaxed
          [&_a]:text-[#35bec5] [&_a:hover]:text-[#2aa0a7] [&_a]:underline-offset-2 [&_a]:underline
          [&_strong]:text-slate-900
          [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-slate-600
          [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-slate-600
          [&_li]:mb-1 [&_li]:leading-relaxed
          [&_blockquote]:mb-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#35bec5]
          [&_blockquote]:bg-slate-50 [&_blockquote]:pl-6 [&_blockquote]:py-4
          [&_blockquote]:text-slate-700 [&_blockquote]:italic
          [&_hr]:my-6 [&_hr]:border-t [&_hr]:border-slate-200"
          style={{ fontFamily: "Inter, sans-serif" }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}

"use client";

export default function Footer() {
  return (
    <section>
      <div className="flex flex-col gap-4 lg:px-6 mt-16">
        <p className="text-sm text-start text-muted-foreground">
          Coded in{" "}
          <a className="text-foreground border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none" href="https://code.visualstudio.com/">
          Visual Studio Code
          </a>
          .{" "}
          Deployed with{" "}
          <a className="text-foreground border-b border-transparent pb-px transition hover:border-primary motion-reduce:transition-none" href="https://docs.github.com/en/pages">
          GitHub Pages
          </a>.
        </p>
      </div>
    </section>
  );
}

"use client";

export default function Footer() {
  return (
    <section>
      <div className="flex flex-col gap-4 lg:px-6 mt-16">
        <p className="text-sm text-start text-muted-foreground">
          © {new Date().getFullYear()} Francis Tran. All rights reserved.
        </p>
      </div>
    </section>
  );
}

import type React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <a href="/revops-data-model-mapper/" className="flex items-center gap-2">
              <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              <span className="text-lg font-semibold text-gray-900">RevOps Data Model Mapper</span>
            </a>
            <nav className="hidden sm:flex items-center gap-1">
              <NavLink href="/revops-data-model-mapper/">Mapper</NavLink>
              <NavLink href="/revops-data-model-mapper/compare">Compare</NavLink>
              <NavLink href="/revops-data-model-mapper/model">Canonical Model</NavLink>
              <NavLink href="/revops-data-model-mapper/export">Export</NavLink>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isActive = typeof window !== "undefined" && window.location.pathname === href;
  return (
    <a
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {children}
    </a>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p className="text-xs text-gray-500 leading-relaxed">
          <strong>Disclaimer:</strong> This tool provides a standard-model comparison for research and
          planning. Real client systems often include custom fields, custom objects, automations,
          permissions, and historical data issues that require implementation review.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Built by <a href="https://decoupledev.com" className="text-indigo-500 hover:text-indigo-600 underline" target="_blank" rel="noopener noreferrer">DecoupleDev</a> &mdash; RevOps Data Model Mapper
        </p>
      </div>
    </footer>
  );
}

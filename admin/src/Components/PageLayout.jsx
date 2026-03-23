import { createContext, useContext } from "react";

const PageLayoutContext = createContext({ maxWidth: "max-w-6xl" });

export function PageLayout({
  icon: Icon,
  title,
  subtitle,
  children,
  maxWidth = "max-w-6xl",
  action,
  className = "",
}) {
  return (
    <PageLayoutContext.Provider value={{ maxWidth }}>
      <div className={`min-h-screen dashboard-bg-pattern ${className}`}>
        <main className="lg:ml-64 pt-16 md:pt-8 pb-8 px-4 sm:px-6 lg:px-8">
          <div className={`${maxWidth} mx-auto`}>
            {(title || action) && (
              <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 animate-slide-up">
                <div>
                  {title && (
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
                      {Icon && (
                        <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 shrink-0">
                          <Icon size={22} />
                        </span>
                      )}
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-dashboard-muted mt-1 text-sm sm:text-base">
                      {subtitle}
                    </p>
                  )}
                </div>
                {action && <div className="flex items-center gap-2">{action}</div>}
              </header>
            )}
            <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
              {children}
            </div>
          </div>
        </main>
      </div>
    </PageLayoutContext.Provider>
  );
}

export function usePageLayout() {
  return useContext(PageLayoutContext);
}

/** Skeleton for page header */
export function PageSkeletonHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 w-48 sm:w-64 bg-slate-200 rounded-xl" />
        <div className="h-4 w-36 sm:w-44 bg-slate-100 rounded-lg" />
      </div>
    </div>
  );
}

/** Skeleton for stat/card grid */
export function PageSkeletonCards({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden animate-pulse"
        >
          <div className="h-40 sm:h-48 bg-slate-200" />
          <div className="p-4 sm:p-5 space-y-3">
            <div className="h-5 w-3/4 bg-slate-200 rounded" />
            <div className="h-4 w-1/2 bg-slate-100 rounded" />
            <div className="h-4 w-full bg-slate-100 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton for table rows */
export function PageSkeletonTable({ rows = 5 }) {
  return (
    <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden animate-pulse">
      <div className="border-b border-slate-200/80 px-4 sm:px-6 py-4">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="h-4 w-24 mt-2 bg-slate-100 rounded" />
      </div>
      <div className="divide-y divide-slate-100">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="px-4 sm:px-6 py-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-slate-200 rounded" />
              <div className="h-3 w-1/4 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-16 bg-slate-100 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton for form page */
export function PageSkeletonForm() {
  return (
    <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card p-4 sm:p-6 md:p-8 animate-pulse">
      <div className="space-y-6">
        <div className="h-10 w-full bg-slate-200 rounded-xl" />
        <div className="h-10 w-full bg-slate-200 rounded-xl" />
        <div className="h-24 w-full bg-slate-100 rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-10 bg-slate-200 rounded-xl" />
          <div className="h-10 bg-slate-200 rounded-xl" />
        </div>
        <div className="h-12 w-full bg-slate-200 rounded-xl mt-8" />
      </div>
    </div>
  );
}

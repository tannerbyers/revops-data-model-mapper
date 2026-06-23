import { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ComparePage } from "./pages/ComparePage";
import { ModelPage } from "./pages/ModelPage";
import { ExportPage } from "./pages/ExportPage";

type Route = "home" | "compare" | "model" | "export";

function getRouteFromPath(): Route {
  const path = window.location.pathname;
  if (path.includes("/compare")) return "compare";
  if (path.includes("/model")) return "model";
  if (path.includes("/export")) return "export";
  return "home";
}

function App() {
  const [route, setRoute] = useState<Route>(getRouteFromPath);

  useEffect(() => {
    const handlePopState = () => setRoute(getRouteFromPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (to: Route) => {
    const paths: Record<Route, string> = {
      home: "/revops-data-model-mapper/",
      compare: "/revops-data-model-mapper/compare",
      model: "/revops-data-model-mapper/model",
      export: "/revops-data-model-mapper/export",
    };
    window.history.pushState({}, "", paths[to]);
    setRoute(to);
  };

  return (
    <Layout>
      <nav className="flex gap-1 mb-6 sm:hidden">
        <MobileNavButton current={route === "home"} onClick={() => navigate("home")}>
          Mapper
        </MobileNavButton>
        <MobileNavButton current={route === "compare"} onClick={() => navigate("compare")}>
          Compare
        </MobileNavButton>
        <MobileNavButton current={route === "model"} onClick={() => navigate("model")}>
          Model
        </MobileNavButton>
        <MobileNavButton current={route === "export"} onClick={() => navigate("export")}>
          Export
        </MobileNavButton>
      </nav>

      {route === "home" && <HomePage />}
      {route === "compare" && <ComparePage />}
      {route === "model" && <ModelPage />}
      {route === "export" && <ExportPage />}
    </Layout>
  );
}

function MobileNavButton({
  current,
  onClick,
  children,
}: {
  current: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md ${
        current
          ? "bg-indigo-50 text-indigo-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );
}

export default App;

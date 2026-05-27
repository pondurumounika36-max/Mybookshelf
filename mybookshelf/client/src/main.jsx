// main.jsx
// React entry point. This file:
// - Mounts <App /> into the #root div from index.html
// - Wraps the app in QueryClientProvider so any component can use
//   useQuery / useMutation from @tanstack/react-query.

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);

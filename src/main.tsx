import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./i18n";
import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { CartProvider } from "./contexts/cartProvider.tsx";
import { FirebaseAuthProvider } from "./contexts/currentAuthUserContext.tsx";
// Tirar no futuro.
import { ViewportProvider } from "./contexts/viewPortContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={<p>Something went wrong. Try refreshing the page.</p>}
    >
      <ViewportProvider>
        <BrowserRouter>
          <CartProvider>
            <FirebaseAuthProvider>
              <App />
            </FirebaseAuthProvider>
          </CartProvider>
        </BrowserRouter>
      </ViewportProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);

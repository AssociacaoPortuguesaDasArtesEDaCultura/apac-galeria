import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './i18n';

// Tirar no futuro.
import { ViewportProvider } from './contexts/viewPortContext';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './contexts/cartProvider.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import { FirebaseAuthProvider } from './contexts/currentAuthUserContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <ErrorBoundary
            fallback={<p>Something went wrong. Try refreshing the page.</p>}>
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
    </React.StrictMode>
);

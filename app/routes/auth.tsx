import { usePuterStore } from "../lib/puter";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "CVmind | Auth" },
  { name: "description", content: "Connectez-vous à votre compte" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const next: string = location.search.split("next=")[1];
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(next);
    }
  }, [auth.isAuthenticated, next]);
  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center justify-center">
            <h1>Bienvenue</h1>
            <h2>Connectez-vous pour continuer votre parcours</h2>
          </div>
          {isLoading ? (
            <button className="auth-button animate-pulse">
              <p>Nous vous connectons…</p>
            </button>
          ) : (
            <>
              {auth.isAuthenticated ? (
                <button className="auth-button" onClick={() => auth.signOut()}>
                  <p>Se déconnecter</p>
                </button>
              ) : (
                <button className="auth-button" onClick={() => auth.signIn()}>
                  <p>Se connecter</p>
                </button>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  );
};

export default Auth;

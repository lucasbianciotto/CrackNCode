import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import testImage from "../img/404-octopus.png";

const NotFound: React.FC = () => {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent("Signalement bug 404");
    const body = encodeURIComponent(
      `Bonjour,

Je suis tombé sur une page 404 qui ne devrait pas l'être.
URL concernée : ${currentUrl}

Merci !`
    );
    return `mailto:contact@tonsite.com?subject=${subject}&body=${body}`;
  }, [currentUrl]);

  return (
    <main className="not-found-container" role="main" aria-labelledby="nf-title">
      {/* Bouton "Signaler un bug" en haut à droite */}
      <nav className="not-found-topbar" aria-label="Signalement">
        <a
          href={mailtoHref}
          className="top-link-bug"
          aria-label="Signaler un bug ou une erreur"
        >
          Signaler un bug
        </a>
      </nav>

      {/* Le 404 renvoie à l'accueil */}
      <Link to="/" aria-label="Retour à l'accueil (via le titre 404)">
        <h1 id="nf-title" className="not-found-title">
          404
        </h1>
      </Link>

      {/* L'image renvoie aussi à l'accueil */}
      <Link to="/" aria-label="Retour à l'accueil (via l'image)">
        <img
          src={testImage}
          alt="Poulpe pirate illustrant l'erreur 404"
          className="not-found-img"
          draggable={false}
        />
      </Link>

      <p className="not-found-text">
        Oups... la page que vous cherchez n'existe pas
      </p>

      <Link to="/" className="not-found-link" aria-label="Retour à l'accueil">
        Retour à l'accueil
      </Link>

      {/* Bandeau bas : "Toujours perdu ? Contactez-nous" */}
      <p className="not-found-bottom">
        Toujours perdu ?{" "}
        <a href={mailtoHref} className="bottom-mail">
          Contactez-nous
        </a>
      </p>
    </main>
  );
};

export default NotFound;

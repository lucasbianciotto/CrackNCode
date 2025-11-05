import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";
import testImage from "../img/404-octopus.png";

const NotFound: React.FC = () => {
  return (
    <main className="not-found-container" role="main" aria-labelledby="nf-title">
      <h1 id="nf-title" className="not-found-title">404</h1>

      <img
        src={testImage}
        alt="Poulpe pirate illustrant l'erreur 404"
        className="not-found-img"
        draggable={false}
      />

      <p className="not-found-text">
        Oups... la page que vous cherchez n'existe pas
      </p>

      <Link to="/" className="not-found-link" aria-label="Retour à l'accueil">
        Retour à l'accueil
      </Link>
    </main>
  );
};

export default NotFound;
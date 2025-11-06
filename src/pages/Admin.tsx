// ============================================
// PAGE ADMIN - À RETIRER EN PRODUCTION
// ============================================
// Cette page permet de reset un utilisateur ou de débloquer tout pour les tests.
// Pour la retirer : supprimez ce fichier et la route dans App.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2, Unlock, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isResetting, setIsResetting] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleReset = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    if (!confirm("⚠️ ATTENTION : Cette action va supprimer TOUTES vos données (progression, XP, succès, activités). Êtes-vous sûr ?")) {
      return;
    }

    setIsResetting(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/reset-user`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Utilisateur reset avec succès !");
        // Recharger la page pour actualiser les données
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Erreur lors du reset");
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors du reset");
    } finally {
      setIsResetting(false);
    }
  };

  const handleUnlockAll = async () => {
    if (!user) {
      toast.error("Vous devez être connecté");
      return;
    }

    if (!confirm("Débloquer tous les langages à 100% ? Cela vous permettra d'accéder au combat contre le Kraken.")) {
      return;
    }

    setIsUnlocking(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/unlock-all`, {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Tous les langages débloqués ! ${data.totalXP} XP accordés.`);
        // Recharger la page pour actualiser les données
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error("Erreur lors du déblocage");
      }
    } catch (err) {
      console.error("Erreur:", err);
      toast.error("Erreur lors du déblocage");
    } finally {
      setIsUnlocking(false);
    }
  };

  if (!user) {
    return (
      <AppLayout>
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">Vous devez être connecté pour accéder à cette page.</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Retour à l'accueil
          </Button>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>

        <Card className="p-6 border-destructive/50 bg-destructive/5">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-destructive shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-foreground mb-1">Page Admin - Tests</h2>
              <p className="text-sm text-muted-foreground">
                Cette page est destinée aux tests uniquement. Retirez-la avant la mise en production.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Reset User */}
          <Card className="p-6 border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-destructive/20">
                <Trash2 className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Reset Utilisateur</h3>
                <p className="text-sm text-muted-foreground">Supprime toutes les données</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Cette action va supprimer :
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Toute votre progression (niveaux complétés)</li>
                <li>Tous vos XP</li>
                <li>Tous vos succès</li>
                <li>Toutes vos activités</li>
                <li>Réinitialiser votre avatar aux valeurs par défaut</li>
              </ul>
            </p>
            <Button
              onClick={handleReset}
              disabled={isResetting}
              variant="destructive"
              className="w-full"
            >
              {isResetting ? "Reset en cours..." : "Reset Complet"}
            </Button>
          </Card>

          {/* Unlock All */}
          <Card className="p-6 border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-success/20">
                <Unlock className="w-6 h-6 text-success" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Débloquer Tout</h3>
                <p className="text-sm text-muted-foreground">100% de tous les langages</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Cette action va :
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Compléter tous les niveaux de tous les langages</li>
                <li>Vous accorder l'XP correspondant</li>
                <li>Débloquer l'accès au combat contre le Kraken</li>
              </ul>
            </p>
            <Button
              onClick={handleUnlockAll}
              disabled={isUnlocking}
              className="w-full bg-success hover:bg-success/90"
            >
              {isUnlocking ? "Déblocage en cours..." : "Débloquer Tout à 100%"}
            </Button>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}


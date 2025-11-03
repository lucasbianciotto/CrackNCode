import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { mockUser } from "@/data/mockUser";
import { Card } from "@/components/ui/card";
import { Award, TrendingUp, Calendar } from "lucide-react";
import { useState } from "react";
import { AvatarCustomizer, AvatarOptions } from "@/components/profile/AvatarCustomizer";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Profile = () => {
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions | null>(null);
  const [open, setOpen] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <ProfileHeader user={{ ...mockUser, avatarOptions }} />
        
        <div className="mt-6">
          <h2 className="text-lg font-bold mb-2">Personnaliser mon avatar</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-2">Modifier mon avatar</Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-lg font-bold mb-4">Personnaliser mon avatar</h2>
              <AvatarCustomizer onChange={setAvatarOptions} />
              <DialogClose asChild>
                <Button className="mt-4 w-full">Fermer</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Achievements Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-secondary" />
            <h2 className="text-xl font-bold text-foreground">Succès débloqués</h2>
          </div>
          
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 rounded-lg bg-muted border border-border">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold text-foreground mb-1">First Blood</h3>
              <p className="text-sm text-muted-foreground">Premier défi complété</p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted border border-border">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-foreground mb-1">Speed Demon</h3>
              <p className="text-sm text-muted-foreground">Défi complété en moins de 5 min</p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted border border-border">
              <div className="text-3xl mb-2">✨</div>
              <h3 className="font-bold text-foreground mb-1">Perfectionist</h3>
              <p className="text-sm text-muted-foreground">Score parfait sur un défi</p>
            </div>
          </div>
        </Card>
        
        {/* Activity Section */}
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold text-foreground">Activité récente</h2>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Python - Dictionnaires</p>
                <p className="text-xs text-muted-foreground">Complété il y a 2 heures</p>
              </div>
              <span className="text-accent font-bold">+300 XP</span>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">JavaScript - DOM Manipulation</p>
                <p className="text-xs text-muted-foreground">Complété il y a 1 jour</p>
              </div>
              <span className="text-accent font-bold">+200 XP</span>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;

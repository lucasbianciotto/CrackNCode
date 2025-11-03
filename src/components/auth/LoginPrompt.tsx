import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface LoginPromptProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export const LoginPrompt = ({ open, onOpenChange }: LoginPromptProps) => {
	const { loginWithGoogle } = useAuth();

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Connexion requise</DialogTitle>
					<DialogDescription>
						Connectez-vous avec Google pour accéder aux niveaux et jouer aux mini-jeux.
					</DialogDescription>
				</DialogHeader>
				<div className="flex justify-end">
					<Button onClick={loginWithGoogle}>Se connecter avec Google</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};



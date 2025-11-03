import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { LogIn } from "lucide-react";

const Login = () => {
	const { loginWithGoogle } = useAuth();

	return (
		<AppLayout>
			<div className="flex items-center justify-center py-16">
				<Card className="w-full max-w-md">
					<CardHeader>
						<CardTitle>Connexion</CardTitle>
						<CardDescription>
							Connectez-vous avec Google pour commencer. Votre niveau démarre à 1.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button className="w-full gap-2" onClick={loginWithGoogle}>
							<LogIn className="w-4 h-4" />
							Se connecter avec Google
						</Button>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
};

export default Login;



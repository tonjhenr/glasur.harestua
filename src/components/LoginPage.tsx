import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import logo from "figma:asset/ef6a37961f64004c649f85d97770b18fa518692b.png";

type LoginPageProps = {
  onLogin: (
    username: string,
    password: string,
    isAdmin: boolean,
  ) => boolean;
  onRegister?: (
    email: string,
    password: string,
    name: string,
  ) => boolean;
  adminOnly?: boolean;
};

export function LoginPage({
  onLogin,
  onRegister,
  adminOnly = false,
}: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // For customer registration
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerError, setRegisterError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = onLogin(username, password, true);

    if (success) {
      toast.success("Velkommen!");
    } else {
      setError("Feil brukernavn eller passord");
    }
  };

  const handleCustomerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = onLogin(username, password, false);

    if (success) {
      toast.success("Velkommen!");
    } else {
      setError("Feil e-post eller passord");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (onRegister) {
      const success = onRegister(
        registerEmail,
        registerPassword,
        registerName,
      );
      if (success) {
        toast.success("Konto opprettet! Du kan nå logge inn.");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterName("");
      } else {
        setRegisterError("E-posten er allerede i bruk");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src={logo}
            alt="Glasur.Harestua"
            className="h-20 w-auto mx-auto mb-4"
          />
          <CardTitle>
            {adminOnly ? 'Admin-innlogging' : 'Logg inn for å få tilgang til din side'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {adminOnly ? (
            <form
              onSubmit={handleAdminLogin}
              className="space-y-4"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="admin-username">
                  Brukernavn
                </Label>
                <Input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  required
                  autoComplete="username"
                />
              </div>

              <div>
                <Label htmlFor="admin-password">
                  Passord
                </Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full">
                Logg inn som admin
              </Button>

              <div className="text-center text-muted-foreground mt-4">
                <p>Demo: admin / admin123</p>
              </div>
            </form>
          ) : (
            <Tabs defaultValue="customer" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer">Kunde</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <TabsContent value="customer">
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login">
                      Logg inn
                    </TabsTrigger>
                    <TabsTrigger value="register">
                      Registrer
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <form
                      onSubmit={handleCustomerLogin}
                      className="space-y-4"
                    >
                      {error && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {error}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div>
                        <Label htmlFor="customer-email">
                          E-post
                        </Label>
                        <Input
                          id="customer-email"
                          type="email"
                          value={username}
                          onChange={(e) =>
                            setUsername(e.target.value)
                          }
                          required
                          autoComplete="email"
                          placeholder="din@epost.no"
                        />
                      </div>

                      <div>
                        <Label htmlFor="customer-password">
                          Passord
                        </Label>
                        <Input
                          id="customer-password"
                          type="password"
                          value={password}
                          onChange={(e) =>
                            setPassword(e.target.value)
                          }
                          required
                          autoComplete="current-password"
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Logg inn
                      </Button>

                      <div className="text-center text-muted-foreground mt-4">
                        <p>Demo: kunde@test.no / kunde123</p>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="register">
                    <form
                      onSubmit={handleRegister}
                      className="space-y-4"
                    >
                      {registerError && (
                        <Alert variant="destructive">
                          <AlertDescription>
                            {registerError}
                          </AlertDescription>
                        </Alert>
                      )}

                      <div>
                        <Label htmlFor="register-name">
                          Fullt navn
                        </Label>
                        <Input
                          id="register-name"
                          type="text"
                          value={registerName}
                          onChange={(e) =>
                            setRegisterName(e.target.value)
                          }
                          required
                          placeholder="Ola Nordmann"
                        />
                      </div>

                      <div>
                        <Label htmlFor="register-email">
                          E-post
                        </Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={registerEmail}
                          onChange={(e) =>
                            setRegisterEmail(e.target.value)
                          }
                          required
                          autoComplete="email"
                          placeholder="din@epost.no"
                        />
                      </div>

                      <div>
                        <Label htmlFor="register-password">
                          Passord
                        </Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={registerPassword}
                          onChange={(e) =>
                            setRegisterPassword(e.target.value)
                          }
                          required
                          autoComplete="new-password"
                          minLength={6}
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        Opprett konto
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </TabsContent>

              <TabsContent value="admin">
                <form
                  onSubmit={handleAdminLogin}
                  className="space-y-4"
                >
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label htmlFor="admin-username">
                      Brukernavn
                    </Label>
                    <Input
                      id="admin-username"
                      type="text"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      required
                      autoComplete="username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="admin-password">
                      Passord
                    </Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                      autoComplete="current-password"
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Logg inn som admin
                  </Button>

                  <div className="text-center text-muted-foreground mt-4">
                    <p>Demo: admin / admin123</p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
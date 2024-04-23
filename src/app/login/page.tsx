"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEventHandler } from "react";
import { useRouter } from "next/navigation";

function Login() {
  const router = useRouter();

  const loginSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    router.replace("/");
  };

  return (
    <div className="h-full w-full flex-grow flex justify-center items-center">
      <Card className="w-80">
        <CardHeader className="text-center">
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={loginSubmit}>
            <div>
              <Label>Username:</Label>
              <Input type="text" placeholder="Username"></Input>
            </div>
            <div>
              <Label>Password:</Label>
              <Input type="password" placeholder="Password"></Input>
            </div>
            <div className="flex justify-center">
              <Button type="submit" className="mt-4">
                login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

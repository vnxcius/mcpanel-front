"use client";

import { Session } from "@prisma/client";
import { createContext, useContext, useEffect, useState } from "react";

type SessionContextType = {
  session: Session;
};

export const SessionContext = createContext<SessionContextType>({
  session: {} as Session,
});

export const useSession = () => useContext(SessionContext);

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session>({} as Session);

  useEffect(() => {
    const getSession = async () => {
      const data = await fetch("/api/auth/session").then((res) => res.json());
      setSession(data.session);
    };
    getSession();
  }, []);

  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
}

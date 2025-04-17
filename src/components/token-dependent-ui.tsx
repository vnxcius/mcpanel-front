"use client";

import { useEffect, useState } from "react";
import ButtonGroup from "./button-group";
import TokenInput from "./token-input";

export default function TokenDependentUI() {
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("sss-token");
    setHasToken(!!storedToken);
  }, []);

  if (hasToken === null) {
    return <div className="h-20">carregando...</div>;
  }
  return hasToken ? <ButtonGroup /> : <TokenInput />;
}

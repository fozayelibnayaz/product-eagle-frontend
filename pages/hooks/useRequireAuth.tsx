// ./hooks/useRequireAuth.tsx (Verify this logic)
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { JWT_TOKEN_KEY } from "../../lib/constants";

const useRequireAuth = (): boolean => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isRouterReady = router.isReady; 

  useEffect(() => {
    if (!isRouterReady) return; 

    const token = Cookies.get(JWT_TOKEN_KEY); 

    // The key used here MUST match the cookie name set by the backend (which is "token").
    // Change the constant import JWT_TOKEN_KEY to the literal string "token" if necessary.

    if (!token) {
      if (router.pathname !== "/login") { 
          router.push("/login");
      }
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router, isRouterReady]); 

  return isAuthenticated;
};
export default useRequireAuth;
import {
createContext,
useContext,
useEffect,
useState
} from "react";

import { onAuthStateChanged } from "firebase/auth";

import {
doc,
getDoc
} from "firebase/firestore";

import { auth, db } from "../services/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
const [currentUser, setCurrentUser] = useState(null);
const [userRole, setUserRole] = useState(null);
const [userProfile, setUserProfile] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
const unsubscribe = onAuthStateChanged(
auth,
async (user) => {
setLoading(true);

    if (!user) {
      setCurrentUser(null);
      setUserRole(null);
      setUserProfile(null);
      setLoading(false);
      return;
    }

    setCurrentUser(user);

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const profileData = userSnap.data();

        setUserProfile(profileData);
        setUserRole(profileData.role || "user");

      } else {
        setUserProfile(null);
        setUserRole("user");
      }

    } catch (error) {
      console.error("User profile loading error:", error);

      setUserProfile(null);
      setUserRole("user");

    } finally {
      setLoading(false);
    }
  }
);

return () => unsubscribe();


}, []);

// Give normal users both capabilities.
// Do not automatically grant administrative capabilities.
const capabilities =
userProfile?.capabilities ||
(
["admin", "superadmin", "deliveryPartner"].includes(userRole)
? []
: ["seeker", "provider"]
);

return (
<AuthContext.Provider
value={{
currentUser,
userRole,
userProfile,
capabilities,
loading
}}
>
{children}
</AuthContext.Provider>
);
}

export function useAuth() {
return useContext(AuthContext);
}

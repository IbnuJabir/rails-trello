import { auth } from "@/auth";
import { cache } from "react";

// getSession.ts - De-duplicate the auth() call to avaoid multiple calls to the server in a single page
export default cache(auth);

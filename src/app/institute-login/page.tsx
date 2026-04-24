import InstituteLoginView from "@/modules/auth/InstituteLoginView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institute Login | Tutor Parliament Trust Platform",
  description: "Secure login for educational institutes and bureaus to access the shared intelligence network.",
};

export default function InstituteLoginPage() {
  return <InstituteLoginView />;
}


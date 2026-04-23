import { Metadata } from "next";
import LoginView from "@/views/auth/LoginView";

export const metadata: Metadata = {
  title: "Login | Tutors Parliament Trust Intelligence",
  description: "Secure login for the private B2B intelligence network for institutes and agencies.",
};

export default function LoginPage() {
  return <LoginView />;
}

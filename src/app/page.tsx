import { redirect } from "next/navigation";

export default function ProRootPage() {
  redirect("/auth/login");
}

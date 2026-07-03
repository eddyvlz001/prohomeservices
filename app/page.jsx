import HomeClient from "./home-client";
import { getPortfolio } from "@/lib/db";

// Siempre trae los datos más recientes (no cachea en build) porque
// las fotos se pueden editar en cualquier momento desde /admin.
export const dynamic = "force-dynamic";

export default async function Page() {
  const portfolio = await getPortfolio();
  return <HomeClient portfolio={portfolio} />;
}

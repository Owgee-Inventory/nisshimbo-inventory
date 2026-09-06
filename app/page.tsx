import { getAuthenticatedUser } from "@/lib/auth/authorization";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login");
  }

  const appUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      active: true,
      userRoles: {
        where: {
          role: {
            is: {
              active: true,
            }
          }
        }
      }
    }
  });

  if (!appUser?.active || appUser.userRoles.length === 0) {
    redirect("/dashboard");
  }
}

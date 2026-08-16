import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getLinksForCurrentUser } from "@/data/links";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateLinkDialog } from "./create-link-dialog";
import { EditLinkDialog } from "./edit-link-dialog";
import { DeleteLinkDialog } from "./delete-link-dialog";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const links = await getLinksForCurrentUser();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Links</h1>
        <CreateLinkDialog />
      </div>

      {links.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No links yet</CardTitle>
            <CardDescription>
              You haven&apos;t created any short links yet.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className="flex flex-col gap-3">
          {links.map((link) => (
            <li key={link.id}>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="break-all">
                        {link.shortCode}
                      </CardTitle>
                      <CardDescription className="break-all">
                        {link.url}
                      </CardDescription>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <EditLinkDialog link={link} />
                      <DeleteLinkDialog
                        id={link.id}
                        shortCode={link.shortCode}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Created {link.createdAt.toLocaleDateString()}
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link2, FolderOpen, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Shorten Any URL",
    description:
      "Transform long, unwieldy links into clean, shareable short URLs in seconds.",
  },
  {
    icon: FolderOpen,
    title: "Manage Your Links",
    description:
      "View, edit, and organize all your shortened links from one central dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    description:
      "Built with modern authentication and a serverless database to keep your links safe and fast.",
  },
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-24 text-center">
        <div className="flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            <Link2 className="size-3" />
            URL Shortener
          </span>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Short links, big impact
          </h1>
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            Create concise, memorable links in one click. Manage your collection
            and share with confidence.
          </p>
        </div>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <Button size="lg" className="px-8">
              Get started — it&apos;s free
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Everything you need to manage links
            </h2>
            <p className="mt-2 text-muted-foreground">
              Simple, powerful tools that help you share smarter.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="flex flex-col items-center gap-6 px-6 py-20 text-center">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Ready to shorten your first link?
        </h2>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <Button size="lg" className="px-10">
            Create a free account
          </Button>
        </SignUpButton>
      </section>
    </div>
  );
}

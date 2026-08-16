"use client";

import { useId, useState, useTransition, type FormEvent } from "react";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateLinkAction } from "./actions";
import type { LinkRecord } from "@/data/links";

export function EditLinkDialog({
  link,
}: {
  link: Pick<LinkRecord, "id" | "url" | "shortCode">;
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(link.url);
  const [customCode, setCustomCode] = useState(link.shortCode);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const urlId = useId();
  const codeId = useId();

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setUrl(link.url);
      setCustomCode(link.shortCode);
      setError(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await updateLinkAction({ id: link.id, url, customCode });

      if (result.error) {
        setError(result.error);
        return;
      }

      handleOpenChange(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button variant="outline" size="icon-sm" aria-label="Edit link" />
        }
      >
        <PencilIcon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit link</DialogTitle>
          <DialogDescription>
            Update the destination URL or short code.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <Label htmlFor={urlId}>Destination URL</Label>
            <Input
              id={urlId}
              type="url"
              placeholder="https://example.com/my-long-link"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={isPending}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={codeId}>Short code</Label>
            <Input
              id={codeId}
              placeholder="my-code"
              value={customCode}
              onChange={(event) => setCustomCode(event.target.value)}
              disabled={isPending}
              required
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

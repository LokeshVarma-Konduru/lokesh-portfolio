import { Separator } from "@/components/ui/separator";
import { personal } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6">
      <Separator />
      <p className="pt-8 pb-24 text-center text-sm text-muted-foreground md:pb-8">
        Built by {personal.name} · {new Date().getFullYear()}
      </p>
    </footer>
  );
}

import { Button } from "./components/ui/button";

interface DomainFilterProps {
  domains: string[];
  selectedDomain: string;
  onDomainChange: (domain: string) => void;
}

export function DomainFilter({
  domains,
  selectedDomain,
  onDomainChange,
}: DomainFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {domains.map((domain) => (
        <Button
          key={domain}
          variant={selectedDomain === domain ? "default" : "outline"}
          size="sm"
          onClick={() => onDomainChange(domain)}
          className={`text-xs ${
            selectedDomain === domain
              ? "bg-white text-black hover:bg-zinc-200"
              : "border-zinc-600 text-zinc-300 hover:bg-zinc-700 hover:text-white"
          }`}
        >
          {domain === "all" ? "All Domains" : domain}
        </Button>
      ))}
    </div>
  );
}

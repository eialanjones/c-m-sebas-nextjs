import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode; // Novo prop para o ícone
}

export function PainelCard({ title, children, className, icon }: CardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}


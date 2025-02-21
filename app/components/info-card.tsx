import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface InfoCardProps {
  title?: string
  description?: string
  content?: string
  footer?: string
}

export function InfoCard({ title, description, content, footer }: InfoCardProps) {
  return (
    <Card className="text-sm">
      {title && description && (
        <CardHeader>
          {title && <CardTitle className="text-sm">{title}</CardTitle>}
          {description && <CardDescription className="text-sm">{description}</CardDescription>}
        </CardHeader>
      )}

      <CardContent className="p-4">
        <p className="text-sm">{content}</p>
      </CardContent>
      {footer && (
        <CardFooter>
          <p className="text-sm">{footer}</p>
        </CardFooter>
      )}
    </Card>
  )
}

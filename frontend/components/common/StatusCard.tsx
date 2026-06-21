type StatusCardProps = {
  title: string
  value: string
  hint?: string
}

export function StatusCard({ title, value, hint }: StatusCardProps) {
  return (
    <div className="status-card">
      <small>{title}</small>
      <strong>{value}</strong>
      {hint ? <small>{hint}</small> : null}
    </div>
  )
}

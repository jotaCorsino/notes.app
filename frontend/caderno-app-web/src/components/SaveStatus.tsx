interface SaveStatusProps {
  label: string
}

export function SaveStatus({ label }: SaveStatusProps) {
  return (
    <span className="save-status" role="status" aria-label={`Status da anotação: ${label}`}>
      <span className="save-status__dot" aria-hidden="true" />
      {label}
    </span>
  )
}

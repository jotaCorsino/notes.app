interface TagListProps {
  tags: string[]
}

export function TagList({ tags }: TagListProps) {
  return (
    <ul className="tag-list" aria-label="Tags da anotação">
      {tags.map((tag) => (
        <li key={tag}>#{tag}</li>
      ))}
    </ul>
  )
}

interface BreadcrumbsProps {
  items: string[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={item} className="breadcrumb-item">
            {index < items.length - 1 ? <a href="#">{item}</a> : <span>{item}</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}

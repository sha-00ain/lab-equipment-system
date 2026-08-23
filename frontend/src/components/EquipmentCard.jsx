import Badge from './Badge'

export default function EquipmentCard({ item, onBorrow }) {
  const isAvailable = item.available_quantity > 0

  return (
    <div className="card p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-semibold text-ink leading-snug">{item.name}</h3>
          <p className="text-xs text-ink/40 uppercase tracking-wide mt-0.5">{item.category}</p>
        </div>
        <Badge status={item.condition} />
      </div>

      {item.description && <p className="text-sm text-ink/60 line-clamp-2">{item.description}</p>}

      <div className="text-sm text-ink/50 flex items-center justify-between mt-auto pt-3 border-t border-line">
        <span className="truncate">{item.location || 'Location not set'}</span>
        <span className="font-mono text-xs text-ink shrink-0 ml-2">
          {item.available_quantity}/{item.total_quantity}
        </span>
      </div>

      <button
        onClick={() => onBorrow(item)}
        disabled={!isAvailable}
        className={isAvailable ? 'btn-accent w-full' : 'btn-secondary w-full'}
      >
        {isAvailable ? 'Request to borrow' : 'Unavailable'}
      </button>
    </div>
  )
}

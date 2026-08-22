const conditionColor = {
  good: 'bg-emerald-100 text-emerald-800',
  fair: 'bg-amber-100 text-amber-800',
  damaged: 'bg-red-100 text-red-800',
  under_repair: 'bg-slate-200 text-slate-700'
}

export default function EquipmentCard({ item, onBorrow }) {
  return (
    <div className="border border-ink/10 rounded-xl p-4 bg-white flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-600 text-ink">{item.name}</h3>
          <p className="text-xs text-ink/50 uppercase tracking-wide">{item.category}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${conditionColor[item.condition] || 'bg-slate-100'}`}>
          {item.condition.replace('_', ' ')}
        </span>
      </div>

      {item.description && <p className="text-sm text-ink/70 line-clamp-2">{item.description}</p>}

      <div className="text-sm text-ink/60 flex items-center justify-between mt-auto pt-2 border-t border-ink/5">
        <span>{item.location || 'Location N/A'}</span>
        <span className="font-medium text-ink">
          {item.available_quantity}/{item.total_quantity} available
        </span>
      </div>

      <button
        onClick={() => onBorrow(item)}
        disabled={item.available_quantity < 1}
        className="w-full py-2 rounded-lg bg-ink text-paper text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-ink/90"
      >
        {item.available_quantity < 1 ? 'Unavailable' : 'Request to borrow'}
      </button>
    </div>
  )
}

const styles = {
  error: 'bg-danger/10 text-danger',
  success: 'bg-teal-50 text-teal-700',
  info: 'bg-ink/5 text-ink/70'
}

export default function Alert({ type = 'info', children }) {
  if (!children) return null
  return (
    <div className={`text-sm rounded-lg px-4 py-3 mb-4 ${styles[type]}`}>
      {children}
    </div>
  )
}

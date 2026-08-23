export default function SetupNotice() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="card max-w-lg w-full p-8">
        <p className="tag bg-amber-50 text-amber-600 inline-block mb-4">Setup needed</p>
        <h1 className="font-display text-xl font-semibold text-ink mb-2">
          Connect this app to Supabase
        </h1>
        <p className="text-sm text-ink/60 mb-6">
          LabTrack can't reach your database yet. This screen appears when the
          <code className="font-mono bg-ink/5 px-1 rounded"> .env</code> file is missing or still
          has placeholder values.
        </p>

        <ol className="text-sm text-ink/70 space-y-2 mb-6 list-decimal list-inside">
          <li>In the <code className="font-mono bg-ink/5 px-1 rounded">frontend</code> folder, copy <code className="font-mono bg-ink/5 px-1 rounded">.env.example</code> to <code className="font-mono bg-ink/5 px-1 rounded">.env</code></li>
          <li>Open your Supabase project → Settings → API</li>
          <li>Paste the Project URL into <code className="font-mono bg-ink/5 px-1 rounded">VITE_SUPABASE_URL</code></li>
          <li>Paste the anon public key into <code className="font-mono bg-ink/5 px-1 rounded">VITE_SUPABASE_ANON_KEY</code></li>
          <li>Save the file and restart <code className="font-mono bg-ink/5 px-1 rounded">npm run dev</code></li>
        </ol>

        <p className="text-xs text-ink/40">
          This message only shows during setup — once connected, your users will never see it.
        </p>
      </div>
    </div>
  )
}

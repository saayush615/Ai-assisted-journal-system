import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [journals, setJournals] = useState([])
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user?.id) return
    const fetchData = async () => {
      try {
        const [journalsRes, insightsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/journal/${user.id}`, { withCredentials: true }),
          axios.get(`${import.meta.env.VITE_API_URL}/api/journal/insights/${user.id}`, { withCredentials: true }),
        ])
        setJournals(journalsRes.data?.response ?? [])
        setInsights(insightsRes.data?.insights ?? null)
      } catch (err) {
        setError('Failed to load journals.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b px-6 py-3 flex items-center justify-between">
        <span className="font-semibold text-lg tracking-tight">AI Journal</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="destructive" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Your Journals</h1>
          <p className="text-muted-foreground text-sm mt-1">All your saved entries in one place.</p>
        </div>

        {insights && (
          <div className="border rounded-xl p-5 bg-muted/40 flex flex-col gap-3">
            <h2 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">Your Insights</h2>
            <div className="flex gap-2 flex-wrap items-center">
              <span className="text-sm">Entries:</span>
              <span className="text-sm px-3 py-1 bg-background border rounded-full">{insights.totalEntries}</span>
              {insights.topEmotion && (
                <>
                  <span className="text-sm">Top emotion:</span>
                  <span className="text-sm px-3 py-1 bg-background border rounded-full capitalize">{insights.topEmotion}</span>
                </>
              )}
              {insights.mostUsedAmbience && (
                <>
                  <span className="text-sm">Favourite ambience:</span>
                  <span className="text-sm px-3 py-1 bg-background border rounded-full capitalize">{insights.mostUsedAmbience}</span>
                </>
              )}
            </div>
            {insights.recentKeywords?.length > 0 && (
              <div className="flex gap-2 flex-wrap items-center">
                <span className="text-sm">Recent keywords:</span>
                {insights.recentKeywords.map((kw) => (
                  <span key={kw} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {loading && (
          <p className="text-sm text-muted-foreground">Loading...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && journals.length === 0 && (
          <p className="text-sm text-muted-foreground">No journal entries yet. Start writing!</p>
        )}

        {journals.map((journal) => (
          <div key={journal._id} className="border rounded-xl p-5 bg-muted/40 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {new Date(journal.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </span>
              {journal.ambience && (
                <span className="text-xs px-2.5 py-1 rounded-full border capitalize text-muted-foreground">
                  {journal.ambience}
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed line-clamp-3">{journal.text}</p>

            {(journal.emotion || journal.keywords?.length > 0 || journal.summary) && (
              <>
                <div className="h-px bg-border" />
                <h3 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">
                  AI Analysis
                </h3>
                <div className="flex gap-2 flex-wrap items-center">
                  {journal.emotion && (
                    <>
                      <span className="text-sm">Emotion:</span>
                      <span className="text-sm px-3 py-1 bg-background border rounded-full capitalize">
                        {journal.emotion}
                      </span>
                    </>
                  )}
                  {journal.keywords?.length > 0 && (
                    <>
                      <span className="text-sm">Keywords:</span>
                      {journal.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          {kw}
                        </span>
                      ))}
                    </>
                  )}
                </div>
                {journal.summary && (
                  <p className="text-sm text-muted-foreground italic">"{journal.summary}"</p>
                )}
              </>
            )}
          </div>
        ))}
      </main>
    </div>
  )
}

export default Dashboard

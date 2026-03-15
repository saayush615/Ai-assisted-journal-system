import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios'

import { useAuth } from '@/hooks/useAuth'

const Home = () => {
   const { user, logout, isAuthenticated } = useAuth();
   const AMBIENCES = ['forest', 'ocean', 'mountain'];
   const [ambience, setAmbience] = useState('');
   const [text, setText] = useState('');
   const [analysis, setAnalysis] = useState(null);
   const [analyzing, setAnalyzing] = useState(false);
   const [submitting, setSubmitting] = useState(false);

  const handleLogout = async () => {
    await logout()
  }

  const handleAnalyze = async () => {
    const payload = {
      text: text.trim(),
      ambience,
    }

    if (!payload.text || !payload.ambience) return;

    setAnalyzing(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/journal/analyze`, payload,{
        withCredentials: true
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false)
    }
  }

  const handleSubmit = async () => {
    const payload = {
      text: text.trim(),
      ambience,
    }

    if (!payload.text || !payload.ambience) return;

    setSubmitting(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/journal/`, payload,{
        withCredentials: true
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background">

          <nav className="border-b px-6 py-3 flex items-center justify-between">
            <span className="font-semibold text-lg tracking-tight">AI Journal</span>
            <div className="flex gap-2">
              {isAuthenticated ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

        {/* Main */}
        <main className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">What's on your mind?</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Write journal entry freely. Let AI understand your mood.
            </p>
          </div>

          {/* Ambience Selector */}
          <div className="flex gap-2 justify-center">
            {AMBIENCES.map((a) => (
              <button
                key={a}
                onClick={() => setAmbience(a)}
                disabled={ analyzing || submitting }
                className={`px-4 py-1.5 rounded-full text-sm border transition-colors capitalize
                  ${ambience === a
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-foreground'
                  }`}
              >
                {a}
              </button>
            ))}
          </div>

          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your journal entry..."
            disabled={ analyzing || submitting }
          />

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleAnalyze}
              disabled={!text.trim() || !ambience || analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!text.trim() || !ambience || submitting || !user}
              title={!user ? 'Login to save entries' : ''}
            >
              {submitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>

          {/* Analysis Result */}
          {analysis && (
            <div className="border rounded-xl p-5 bg-muted/40 flex flex-col gap-3">
              <h2 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                AI Analysis
              </h2>
              <div className="flex gap-2 flex-wrap">
                <span className="text-sm px-3 py-1 bg-background border rounded-full capitalize">
                  {analysis.emotion}
                </span>
                {analysis.keywords?.map((kw) => (
                  <span
                    key={kw}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {kw}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground italic">"{analysis.summary}"</p>
            </div>
          )}
        </main>

      </div>

      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Home

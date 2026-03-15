import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useForm } from 'react-hook-form'
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

   // Auth dialog state
  const [authDialogOpen, setAuthDialogOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'register'
  const [authError, setAuthError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: authSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const handleLogout = async () => {
    await logout()
  }

  const openAuthDialog = (mode) => {
    setAuthMode(mode)
    setAuthError('')
    reset({ name: '', email: '', password: '' })
    setAuthDialogOpen(true)
  }

  const onAuthSubmit = async (values) => {
    setAuthError('')
    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register'
    const payload =
      authMode === 'login'
        ? { email: values.email, password: values.password }
        : { name: values.name, email: values.email, password: values.password }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, payload, {
        withCredentials: true,
      })
      setAuthDialogOpen(false)
      reset({ name: '', email: '', password: '' })
      window.location.reload()
    } catch (error) {
      setAuthError(
        error?.response?.data?.message || 'Authentication failed. Try again.'
      )
    }
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
      setAnalysis(res.data?.analysis)
    } catch (error) {
      console.error(error);
    } finally {
      setAnalyzing(false)
    }
  }

  const handleJournalSubmit = async () => {
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthDialog('login')}
                >
                  Login
                </Button>
                <Button size="sm" onClick={() => openAuthDialog('register')}>
                  Sign Up
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
              onClick={handleJournalSubmit}
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

      <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === 'login' ? 'Login' : 'Create Account'}</DialogTitle>
            <DialogDescription>
              {authMode === 'login'
                ? 'Enter your credentials to continue.'
                : 'Fill the form to create your account.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onAuthSubmit)} className="space-y-3">
            {authMode === 'register' && (
              <div>
                <Input
                  placeholder="Name"
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                )}
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {authError && <p className="text-sm text-red-500">{authError}</p>}

            <Button type="submit" className="w-full" disabled={authSubmitting}>
              {authSubmitting
                ? (authMode === 'login' ? 'Logging in...' : 'Registering...')
                : (authMode === 'login' ? 'Login' : 'Sign Up')}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {authMode === 'login' ? (
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setAuthMode('register')
                    setAuthError('')
                    reset({ name: '', email: '', password: '' })
                  }}
                >
                  Don’t have an account? Sign up
                </button>
              ) : (
                <button
                  type="button"
                  className="underline"
                  onClick={() => {
                    setAuthMode('login')
                    setAuthError('')
                    reset({ name: '', email: '', password: '' })
                  }}
                >
                  Already have an account? Login
                </button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Home

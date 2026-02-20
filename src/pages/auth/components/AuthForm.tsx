import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Mail, Lock, User } from "lucide-react"
import { toast } from 'sonner'
import { supabase } from '../../../lib/supabase'

interface AuthFormProps {
    isLogin: boolean;
    onToggleMode: () => void;
}

export function AuthForm({ isLogin, onToggleMode }: AuthFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<{ email?: string; password?: string; name?: string }>({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
    }

    const validate = () => {
        const newErrors: typeof errors = {}
        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!isLogin && !formData.name) {
            newErrors.name = 'Name is required'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return;

        setIsLoading(true)
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                })
                if (error) throw error
                toast.success("Successfully logged in!")
            } else {
                const { error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                    options: {
                        data: { full_name: formData.name }
                    }
                })
                if (error) throw error
                toast.success("Account created successfully!")
            }
        } catch (error: any) {
            toast.error(error.message || "An error occurred during authentication.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSocialAuth = async (provider: 'google' | 'azure') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            })
            if (error) throw error
        } catch (error: any) {
            toast.error(error.message || "Social login failed.")
        }
    }

    return (
        <Card className="border-slate-200/50 dark:border-slate-800/50 backdrop-blur-xl bg-white/80 dark:bg-brand-surface/80 shadow-2xl overflow-hidden shadow-brand-primary/5">
            <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-3xl font-bold tracking-tight bg-gradient-to-br from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription>
                    {isLogin ? 'Enter your credentials to access your account' : 'Sign up to start managing your budget'}
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div className="space-y-2 relative group">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-brand-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all dark:text-white placeholder:text-slate-400/80"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-brand-danger ml-1">{errors.name}</p>}
                        </div>
                    )}

                    <div className="space-y-2 relative group">
                        <label className="text-xs font-medium text-slate-500 dark:text-slate-400 ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-brand-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all dark:text-white placeholder:text-slate-400/80"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-brand-danger ml-1">{errors.email}</p>}
                    </div>

                    <div className="space-y-2 relative group">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Password</label>
                            {isLogin && (
                                <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Phase 1: Password reset flow not implemented") }} className="text-xs text-brand-primary hover:underline transition-all">Forgot password?</a>
                            )}
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-brand-primary transition-colors" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700/60 bg-white/50 dark:bg-brand-surface/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all dark:text-white placeholder:text-slate-400/80"
                            />
                        </div>
                        {errors.password && <p className="text-xs text-brand-danger ml-1">{errors.password}</p>}
                    </div>

                    <Button type="submit" isLoading={isLoading} className="w-full h-11 text-base mt-2 relative overflow-hidden group">
                        <span className="relative z-10">{isLogin ? 'Sign In' : 'Create Account'}</span>
                        <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
                    </Button>
                </form>

                <div className="mt-8 flex items-center justify-center space-x-4">
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">Or continue with</span>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                    <Button variant="outline" type="button" className="h-11 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-brand-surface/80" onClick={() => handleSocialAuth('google')}>
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </Button>
                    <Button variant="outline" type="button" className="h-11 border-slate-200 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-brand-surface/80" onClick={() => handleSocialAuth('azure')}>
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 21 21">
                            <path d="M10 0H0v10h10V0z" fill="#f25022" />
                            <path d="M21 0H11v10h10V0z" fill="#7fba00" />
                            <path d="M10 11H0v10h10V11z" fill="#00a4ef" />
                            <path d="M21 11H11v10h10V11z" fill="#ffb900" />
                        </svg>
                        Microsoft
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="pt-2 pb-8 justify-center">
                <div className="text-sm text-slate-500 dark:text-slate-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={onToggleMode}
                        className="font-medium text-brand-primary hover:text-brand-primary/80 transition-colors hover:underline"
                    >
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </div>
            </CardFooter>
        </Card>
    )
}

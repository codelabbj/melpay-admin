"use client"

import type React from "react"

import { useState } from "react"
import { useLogin } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, Sparkles } from "lucide-react"
import Image from "next/image";
import logo from "@/public/logo.png"

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login.mutate({ email_or_phone: emailOrPhone, password })
  }

  return (
      <div className="min-h-screen w-full relative overflow-hidden">
          {/* Full page gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary/60">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-accent/30"></div>
          </div>

          {/* Animated background elements */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

          {/* Centered card container */}
          <div className="relative z-10 min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
              <div className="w-full max-w-md sm:max-w-lg">
                  {/* Card with logo and form */}
                  <div className="bg-background/95 backdrop-blur-xl border-2 border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
                      {/* Logo section at top of card */}
                      <div className="bg-gradient-to-br from-primary/10 via-accent/5 to-transparent pt-8 sm:pt-10 pb-6 sm:pb-8 px-6 sm:px-8 text-center border-b border-border/50">
                          <div className="inline-flex items-center justify-center mb-4 sm:mb-5">
                              <div className="relative">
                                  <div className="absolute inset-0 bg-primary/30 rounded-2xl blur-xl"></div>
                                  <Image
                                      src={logo}
                                      alt="MELPAY logo"
                                      className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ring-4 ring-primary/20 shadow-lg"
                                  />
                              </div>
                          </div>
                          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                              MELPAY
                          </h1>
                          <p className="text-sm sm:text-base text-muted-foreground">
                              Accédez à votre tableau de bord administrateur
                          </p>
                      </div>

                      {/* Form section */}
                      <div className="p-6 sm:p-8 md:p-10">

                          <form onSubmit={handleSubmit} className="space-y-6">
                              <div className="space-y-2">
                                  <Label htmlFor="email_or_phone" className="text-sm font-semibold">
                                      Email ou Téléphone
                                  </Label>
                                  <div className="relative">
                                      <Input
                                          id="email_or_phone"
                                          type="text"
                                          placeholder="john.doe@example.com ou 2250700000003"
                                          value={emailOrPhone}
                                          onChange={(e) => setEmailOrPhone(e.target.value)}
                                          required
                                          disabled={login.isPending}
                                          className="h-12 bg-background/50 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                  </div>
                              </div>

                              <div className="space-y-2">
                                  <Label htmlFor="password" className="text-sm font-semibold">
                                      Mot de passe
                                  </Label>
                                  <div className="relative">
                                      <Input
                                          id="password"
                                          type={showPassword ? "text" : "password"}
                                          placeholder="Saisissez votre mot de passe"
                                          value={password}
                                          onChange={(e) => setPassword(e.target.value)}
                                          required
                                          disabled={login.isPending}
                                          className="h-12 pr-12 bg-background/50 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                      />
                                      <button
                                          type="button"
                                          onClick={() => setShowPassword(!showPassword)}
                                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                                          disabled={login.isPending}
                                      >
                                          {showPassword ? (
                                              <EyeOff className="h-5 w-5" />
                                          ) : (
                                              <Eye className="h-5 w-5" />
                                          )}
                                      </button>
                                  </div>
                              </div>

                              <Button
                                  type="submit"
                                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                                  disabled={login.isPending}
                              >
                                  {login.isPending ? (
                                      <>
                                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                          Connexion en cours...
                                      </>
                                  ) : (
                                      <>
                                          <Sparkles className="mr-2 h-5 w-5" />
                                          Se connecter
                                      </>
                                  )}
                              </Button>
                          </form>

                      </div>
                  </div>
              </div>
          </div>
      </div>
  )
}

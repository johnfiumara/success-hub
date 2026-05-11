"use client"

import { useActionState } from "react"
import Link from "next/link"
import { signup } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null)

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <div className="mt-1">
          <Input id="name" name="name" type="text" autoComplete="name" required />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email address</Label>
        <div className="mt-1">
          <Input id="email" name="email" type="email" autoComplete="email" required />
        </div>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <div className="mt-1">
          <Input id="password" name="password" type="password" autoComplete="new-password" required />
        </div>
      </div>

      {state?.error && (
        <div className="text-red-500 text-sm font-medium">{state.error}</div>
      )}

      <div>
        <Button type="submit" disabled={isPending} className="w-full bg-sage hover:bg-sage-dark text-white">
          {isPending ? "Creating account..." : "Sign up"}
        </Button>
      </div>

      <div className="mt-6 text-center text-sm">
        <span className="text-gray-500">Already have an account? </span>
        <Link href="/login" className="font-medium text-sage hover:text-sage-dark">
          Sign in
        </Link>
      </div>
    </form>
  )
}

"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/lib/utils"
import { userAuthSchema } from "@/lib/validations/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "rohansen856@gmail.com",
      password: "pass123",
    },
  })
  const [isCredentialsLoading, setIsCredentialsLoading] =
    React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const callbackUrl = searchParams?.get("from") || "/dashboard"

  async function onSubmit(data: FormData) {
    if (!data.password) {
      return toast({
        title: "Password required",
        description: "Enter your password to sign in.",
        variant: "destructive",
      })
    }

    setIsCredentialsLoading(true)

    const signInResult = await signIn("credentials", {
      email: data.email.toLowerCase(),
      password: data.password,
      redirect: false,
      callbackUrl,
    })

    setIsCredentialsLoading(false)

    if (!signInResult?.ok || signInResult?.error) {
      return toast({
        title: "Sign in failed",
        description:
          "Those credentials didn't match the demo account. Try the values shown below the form.",
        variant: "destructive",
      })
    }

    toast({
      title: "Signed in",
      description: "Redirecting you to your dashboard…",
    })

    router.push(signInResult.url || callbackUrl)
    router.refresh()
  }

  const isLoading = isCredentialsLoading || isGoogleLoading

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <Button disabled={isLoading} type="submit">
            {isCredentialsLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Sign in with Email
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Demo account:{" "}
            <code className="rounded bg-muted px-1 py-0.5">
              rohansen856@gmail.com
            </code>{" "}
            /{" "}
            <code className="rounded bg-muted px-1 py-0.5">pass123</code>
          </p>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGoogleLoading(true)
          signIn("google", { callbackUrl })
        }}
        disabled={isLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 size-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 size-4" />
        )}{" "}
        Google
      </button>
    </div>
  )
}

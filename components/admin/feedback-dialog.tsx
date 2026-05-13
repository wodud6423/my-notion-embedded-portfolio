"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { MessageSquare, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const feedbackSchema = z.object({
  message: z.string().min(1, "피드백 내용을 입력해주세요.").max(500, "500자 이내로 입력해주세요."),
})

type FeedbackFormValues = z.infer<typeof feedbackSchema>

interface FeedbackDialogProps {
  techTitle: string
  notionPageId: string
}

export function FeedbackDialog({ techTitle, notionPageId }: FeedbackDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<"success" | "error" | null>(null)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: { message: "" },
  })

  async function onSubmit(values: FeedbackFormValues) {
    setIsSubmitting(true)
    setSubmitResult(null)
    try {
      const response = await fetch("/api/admin/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageId: notionPageId, message: values.message }),
      })
      if (response.ok) {
        setSubmitResult("success")
        reset()
        setTimeout(() => setOpen(false), 1500)
      } else {
        setSubmitResult("error")
      }
    } catch {
      setSubmitResult("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <MessageSquare className="h-3.5 w-3.5" />
          피드백
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>피드백 전송</DialogTitle>
          <DialogDescription>
            &quot;{techTitle}&quot; 페이지에 Notion 코멘트를 남깁니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="feedback-message">피드백 내용</Label>
            <Textarea
              id="feedback-message"
              placeholder="수정이 필요한 내용을 입력하세요..."
              className="min-h-[100px]"
              {...register("message")}
            />
            {errors.message && (
              <p className="text-xs text-destructive">{errors.message.message}</p>
            )}
          </div>
          {submitResult === "success" && (
            <p className="text-sm text-green-600">코멘트가 Notion에 전송되었습니다.</p>
          )}
          {submitResult === "error" && (
            <p className="text-sm text-destructive">전송 중 오류가 발생했습니다.</p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              전송
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

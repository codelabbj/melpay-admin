"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useCheckTransactionStatus, type Transaction } from "@/hooks/useTransactions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface CheckTransactionStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

export function CheckTransactionStatusDialog({
  open,
  onOpenChange,
  transaction,
}: CheckTransactionStatusDialogProps) {
  const checkStatus = useCheckTransactionStatus()
  const [displayedStatus, setDisplayedStatus] = useState<string | null>(null)

  // Trigger the status check when dialog opens
  useEffect(() => {
    if (open && transaction) {
      setDisplayedStatus(null)
      checkStatus.mutate(transaction.reference)
    }
  }, [open, transaction])

  // Update displayed status when data arrives
  useEffect(() => {
    if (checkStatus.data?.status) {
      setDisplayedStatus(checkStatus.data.status)
    }
  }, [checkStatus.data])

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: "default" | "pending" | "destructive" | "outline"; label: string; icon: React.ReactNode }
    > = {
      pending: { variant: "pending", label: "En attente", icon: <Loader2 className="h-4 w-4 animate-spin" /> },
      accept: { variant: "default", label: "Accepté", icon: <CheckCircle className="h-4 w-4" /> },
      init_payment: { variant: "pending", label: "En cours", icon: <Loader2 className="h-4 w-4 animate-spin" /> },
      error: { variant: "destructive", label: "Erreur", icon: <AlertCircle className="h-4 w-4" /> },
      reject: { variant: "destructive", label: "Rejeté", icon: <AlertCircle className="h-4 w-4" /> },
      timeout: { variant: "outline", label: "Expiré", icon: <AlertCircle className="h-4 w-4" /> },
    }

    const config = statusConfig[status] || { variant: "outline" as const, label: status, icon: null }
    return (
      <Badge variant={config.variant} className="flex items-center gap-2 w-fit">
        {config.icon}
        {config.label}
      </Badge>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Statut de la Transaction</DialogTitle>
          <DialogDescription>Vérification en cours du statut de la transaction</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Reference */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Référence</p>
            <p className="font-mono text-sm text-foreground">{transaction?.reference}</p>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Montant</p>
            <p className="text-lg font-semibold text-foreground">{transaction?.amount} FCFA</p>
          </div>

          {/* Status Loading or Display */}
          <div className="space-y-2 border-t border-border/50 pt-4">
            <p className="text-sm font-medium text-muted-foreground">Statut Actuel</p>
            {checkStatus.isPending ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Chargement du statut...</p>
                </div>
              </div>
            ) : checkStatus.isError ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                  <p className="text-sm text-destructive">Erreur lors du chargement</p>
                </div>
              </div>
            ) : displayedStatus ? (
              <div className="flex items-center gap-3">
                {getStatusBadge(displayedStatus)}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Fermer
          </Button>
          <Button
            onClick={() => {
              setDisplayedStatus(null)
              checkStatus.mutate(transaction?.reference || "")
            }}
            disabled={checkStatus.isPending}
            className="flex-1"
          >
            {checkStatus.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualisation...
              </>
            ) : (
              "Actualiser"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
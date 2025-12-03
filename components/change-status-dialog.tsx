"use client"

import type React from "react"

import { useState } from "react"
import { useChangeTransactionStatus, type Transaction } from "@/hooks/useTransactions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ChangeStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

export function ChangeStatusDialog({ open, onOpenChange, transaction }: ChangeStatusDialogProps) {
  const changeStatus = useChangeTransactionStatus()

  const handleSubmit = () => {
    if (!transaction) return

    changeStatus.mutate(
      {
        reference: transaction.reference,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le Statut de Transaction</DialogTitle>
            <DialogDescription>
                Êtes-vous sûr de vouloir changer le statut de cette transaction ?
                <br />
                <strong>Référence:</strong> {transaction?.reference}
                <br />
                <strong>Montant:</strong> {transaction?.amount} FCFA
            </DialogDescription>
        </DialogHeader>
          <DialogFooter>
              <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={changeStatus.isPending}
              >
                  Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={changeStatus.isPending}>
                  {changeStatus.isPending ? (
                      <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Mise à jour...
                      </>
                  ) : (
                      "Mettre à jour"
                  )}
              </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

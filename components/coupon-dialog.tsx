import {Coupon, CouponInput, useCreateCoupon, useUpdateCoupon} from "@/hooks/use-coupon";
import React, {useEffect, useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import {Platform} from "@/hooks/usePlatforms";

interface CouponDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    platforms:Platform[]
    coupon?: Coupon
}

export function CouponDialog({open,onOpenChange, platforms,coupon}: CouponDialogProps) {
    const createCoupon = useCreateCoupon()
    const updateCoupon = useUpdateCoupon()

    const [formData, setFormData] = useState<CouponInput>({
        bet_app:"",
        code:"",
    })

    useEffect(() => {
        if (coupon) {
            setFormData({
                bet_app:coupon.bet_app,
                code:coupon.code,
            })
        }else{
            setFormData({
                bet_app:"",
                code:"",
            })
        }
    }, [coupon])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (coupon) {
            updateCoupon.mutate(
                { id: coupon.id, data: formData },
                {
                    onSuccess: () => onOpenChange(false),
                },
            )
        } else {
            createCoupon.mutate(formData, {
                onSuccess: () => {
                    onOpenChange(false)
                    setFormData({
                       bet_app:"",
                        code:"",
                    })
                },
            })
        }
    }

    const isPending = createCoupon.isPending || updateCoupon.isPending

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{coupon ? "Modifier Coupon" : "Créer Coupon"}</DialogTitle>
                    <DialogDescription>
                        {coupon ? "Mettre à jour les détails du coupon" : "Ajouter un nouveau coupon"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="code">Code *</Label>
                        <Input
                            id="code"
                            value={formData.code}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                            placeholder="07XXXXXXXX"
                            required
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Platform *</Label>
                        <Select
                            value={formData.bet_app}
                            onValueChange={(value) => setFormData({ ...formData, bet_app: value })}
                            disabled={isPending}
                        >
                            <SelectTrigger id="name">
                                <SelectValue placeholder="Choisir une plateforme" />
                            </SelectTrigger>
                            <SelectContent>
                                {platforms.map((platform) => (
                                    <SelectItem key={platform.id} value={platform.id}>
                                        {platform.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {coupon ? "Enregistrement..." : "Création..."}
                                </>
                            ) : coupon ? (
                                "Mettre à jour"
                            ) : (
                                "Créer"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
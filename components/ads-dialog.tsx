import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";
import React, {useState} from "react";
import {useCreateAd} from "@/hooks/use-ad";
import CustomInput from "@/components/CustomInput";
import {Switch} from "@/components/ui/switch";

interface AdsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AdsDialog({open, onOpenChange}: AdsDialogProps) {
    const createAds = useCreateAd()

    const [formData, setFormData] = useState<{
        image: File | null;
        enable: boolean;
    }>({
        image:null,
        enable: true
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({
                ...formData,
                image:e.target.files[0]
            })
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.image) {
            createAds.mutate(formData,{
                onSuccess: (data) => {
                    onOpenChange(false)
                    setFormData({
                        image:null,
                        enable: true
                    })
                }
            })
        }
    }

    const isPending = createAds.isPending


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Créer Publicité</DialogTitle>
                    <DialogDescription>
                        Ajouter une nouvelle publicité
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <CustomInput onChange={handleFileChange} disabled={isPending} selectedFile={formData.image} onClear={()=>formData.image=null}/>
                    <Switch
                        checked={formData.enable}
                        onChange={()=>formData.enable = !formData.enable}
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement..."
                            </>
                        ) :(
                            <>
                                Créer
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
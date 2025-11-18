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
import {useCreateAd} from "@/hooks/use-advertisement";
import CustomInput from "@/components/CustomInput";
import {Switch} from "@/components/ui/switch";
import {Label} from "@/components/ui/label";

interface AdsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AdsDialog({open, onOpenChange}: AdsDialogProps) {
    const createAds = useCreateAd()

    const [formData, setFormData] = useState<{
        image: File |null;
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
                onSuccess: () => {
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
                    <div className="space-y-2">
                        <Label htmlFor="image">Visuel de publicité</Label>
                        <CustomInput
                            onChange={handleFileChange}
                            disabled={isPending}
                            selectedFile={formData.image}
                            onClear={()=>setFormData({...formData, image:null})}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="enable">Activé la publicité</Label>
                        <Switch
                            id="enable"
                            defaultChecked={true}
                            required
                            onCheckedChange={()=>setFormData({...formData, enable: !formData.enable})}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                        Annuler
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
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
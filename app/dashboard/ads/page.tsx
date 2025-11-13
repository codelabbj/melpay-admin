"use client"

import {Button} from "@/components/ui/button";
import {Loader2, Plus, Trash2} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import TablePagination from "@/components/table-pagination";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useState} from "react";
import {Ad, useAd, useDeleteAd, useUpdateAd} from "@/hooks/use-ad";
import {AdsDialog} from "@/components/ads-dialog";
import Image from "next/image";
import {Switch} from "@/components/ui/switch";

export default function AdsPage() {
    const [adToDelete,setAdToDelete] = useState<Ad|null>(null)
    const [dialogOpen , setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [page,setPage] = useState(1)

    const {data : ads, isLoading} = useAd(page)
    const deleteAd = useDeleteAd()
    const updateAd = useUpdateAd()

    const pageSize = 10

    const handleCreate = () => {
        setDialogOpen(true)
    }

    const handleDelete = (ad:Ad) => {
        setAdToDelete(ad)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (adToDelete) {
            deleteAd.mutate(adToDelete.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false)
                    setAdToDelete(null)
                },
            })
        }
    }
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Publicités
                    </h2>
                    <p className="text-muted-foreground">Gérez les publicités</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter Publicité
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Publicité</CardTitle>
                    <CardDescription>Total : {ads?.count || 0} publicités</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : ads && ads.results.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {ads.results.map((ad)=>(
                                    <div key={ad.id} className="relative group border rounded-md overflow-hidden aspect-square">
                                        <Image src={ad.image} alt={`image-ad-${ad.id}`} fill className="object-cover w-full h-full"/>
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id={`enable-ad-${ad.id}`}
                                                        checked={ad.enable}
                                                        onCheckedChange={() => updateAd.mutate({id: ad.id, enabled: !ad.enable})}
                                                    />
                                                    <label htmlFor={`enable-ad-${ad.id}`} className="text-white font-medium">
                                                        {ad.enable ? "Activé" : "Désactivé"}
                                                    </label>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(ad)}>
                                                    <Trash2 className="h-5 w-5 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <TablePagination page={page} pageSize={pageSize} total={ads.count} disableNextPage={!ads.next} disablePreviousPage={!ads.previous} onChangePage={setPage}/>
                        </>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">Aucune publicité trouvée</div>
                    )}
                </CardContent>
            </Card>

            <AdsDialog open={dialogOpen} onOpenChange={setDialogOpen}/>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ceci supprimera définitivement la publicité. Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-primary/20">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                            {deleteAd.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                "Supprimer"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

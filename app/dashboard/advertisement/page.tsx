"use client"

import {Button} from "@/components/ui/button";
import {Loader2, Plus, Trash2, CheckCircle2, XCircle} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import ContentPagination from "@/components/content-pagination";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useState} from "react";
import {Ad, useAdvertisement, useDeleteAd, useUpdateAd} from "@/hooks/use-advertisement";
import {AdsDialog} from "@/components/ads-dialog";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function AdsPage() {
    const [adToDelete,setAdToDelete] = useState<Ad|null>(null)
    const [dialogOpen , setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [page,setPage] = useState(1)

    const {data : ads, isLoading} = useAdvertisement(page)
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {ads.results.map((ad)=>(
                                    <div key={ad.id} className="group relative overflow-hidden rounded-lg border border-border/50 bg-card shadow-sm hover:shadow-lg transition-all duration-300">
                                        {/* Image Container */}
                                        <div className="relative overflow-hidden bg-muted aspect-square">
                                            <Image
                                                src={ad.image}
                                                alt={`image-ad-${ad.id}`}
                                                fill
                                                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                                            />

                                            {/* Status Badge */}
                                            <div className="absolute top-2 right-2">
                                                {ad.enable ? (
                                                    <Badge className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-1">
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Actif
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-slate-500 hover:bg-slate-600 flex items-center gap-1">
                                                        <XCircle className="h-3 w-3" />
                                                        Inactif
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end p-4">
                                            <div className="flex items-center gap-2 w-full">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="flex-1 text-white hover:bg-white/20"
                                                    onClick={() => updateAd.mutate({id: ad.id, enabled: !ad.enable})}
                                                    disabled={updateAd.isPending}
                                                >
                                                    {updateAd.isPending ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <>{ad.enable ? "Désactiver" : "Activer"}</>
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-destructive hover:bg-destructive/20"
                                                    onClick={() => handleDelete(ad)}
                                                    disabled={deleteAd.isPending}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <ContentPagination
                                currentPage={page}
                                itemsPerPage={pageSize}
                                length={ads.count}
                                startIndex={(page - 1) * pageSize}
                                endIndex={Math.min(page * pageSize, ads.count)}
                                onChangePage={setPage}
                            />
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
                        <AlertDialogCancel className="hover:bg-primary/10">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

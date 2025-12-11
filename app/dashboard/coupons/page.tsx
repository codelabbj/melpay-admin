"use client"

import {Button} from "@/components/ui/button";
import {Loader2, Pencil, Plus, Trash2} from "lucide-react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useState} from "react";
import {Coupon, useCoupon, useDeleteCoupon} from "@/hooks/use-coupon";
import {CouponDialog} from "@/components/coupon-dialog";
import {usePlatforms} from "@/hooks/usePlatforms";
import TablePagination from "@/components/table-pagination";

export default function CouponsPage() {
    const [selectedCoupon,setSelectedCoupon] = useState<Coupon|undefined>(undefined)
    const [couponToDelete,setCouponToDelete] = useState<Coupon|null>(null)
    const [dialogOpen , setDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [page,setPage] = useState(1)

    const {data : coupons, isLoading} = useCoupon(page)
    const {data : platforms} = usePlatforms({})
    const deleteCoupon = useDeleteCoupon()


    const pageSize = 10

    const handleCreate = () => {
        setSelectedCoupon(undefined)
        setDialogOpen(true)
    }

    const handleEdit = (coupon:Coupon) => {
        setSelectedCoupon(coupon)
        setDialogOpen(true)
    }

    const handleDelete = (coupon:Coupon) => {
        setCouponToDelete(coupon)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = () => {
        if (couponToDelete) {
            deleteCoupon.mutate(couponToDelete.id, {
                onSuccess: () => {
                    setDeleteDialogOpen(false)
                    setCouponToDelete(null)
                },
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Coupon</h2>
                    <p className="text-muted-foreground">Gérez les coupons</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter Coupon
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Liste des Coupons</CardTitle>
                    <CardDescription>Total : {coupons?.results.length || 0} coupons</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : coupons && coupons.results.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Code</TableHead>
                                        <TableHead>Plateforme</TableHead>
                                        <TableHead>Date création</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {coupons.results.map((coupon) => (
                                        <TableRow key={coupon.id}>
                                            <TableCell className="font-medium">{coupon.code}</TableCell>
                                            <TableCell>{coupon.bet_app_details.name??"N/A"}</TableCell>
                                            <TableCell>{new Date(coupon.created_at).toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(coupon)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="hover:bg-gray-500/10" onClick={() => handleDelete(coupon)}>
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <TablePagination page={page} pageSize={pageSize} total={coupons.count} disableNextPage={!coupons.next} disablePreviousPage={!coupons.previous} onChangePage={setPage}/>
                        </>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">Aucun coupon trouvé</div>
                    )}
                </CardContent>
            </Card>

            <CouponDialog open={dialogOpen} onOpenChange={setDialogOpen} platforms={platforms??[]} coupon={selectedCoupon}/>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ceci supprimera définitivement le coupon {couponToDelete?.code??'N/A'}. Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-primary/20">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
                            {deleteCoupon.isPending ? (
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
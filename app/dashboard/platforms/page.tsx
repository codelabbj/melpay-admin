"use client"

import { useState } from "react"
import { usePlatforms, useDeletePlatform, type Platform } from "@/hooks/usePlatforms"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react"
import { PlatformDialog } from "@/components/platform-dialog"
import ContentPagination from "@/components/content-pagination"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function PlatformsPage() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [platformToDelete, setPlatformToDelete] = useState<Platform | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const itemsPerPage = 10

  const params = {
    search: search || undefined,
    enable: statusFilter === "all" ? undefined : statusFilter === "active",
  }

  const { data: rawPlatforms, isLoading } = usePlatforms(params)
  const deletePlatform = useDeletePlatform()

  const platforms = rawPlatforms ?? []
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPlatforms = platforms.slice(startIndex, endIndex)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleEdit = (platform: Platform) => {
    setSelectedPlatform(platform)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedPlatform(undefined)
    setDialogOpen(true)
  }

  const handleDelete = (platform: Platform) => {
    setPlatformToDelete(platform)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (platformToDelete) {
      deletePlatform.mutate(platformToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false)
          setPlatformToDelete(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Plateformes</h2>
          <p className="text-muted-foreground">Gérez les plateformes de paris</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter Plateforme
        </Button>
      </div>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          <CardDescription className="text-sm">Rechercher et filtrer les plateformes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par nom de plateforme"
                  value={search}
                  onChange={handleSearchChange}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b border-border/50 bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold">Liste des Plateformes</CardTitle>
              <CardDescription className="text-sm mt-1">Total : {platforms?.length || 0} plateformes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent >
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : platforms && platforms.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border/50">
                      <TableHead className="font-semibold text-muted-foreground h-12">Nom</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Statut</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Dépôt Min</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Dépôt Max</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Retrait Min</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Gain Max</TableHead>
                      <TableHead className="font-semibold text-muted-foreground">Localisation</TableHead>
                      <TableHead className="font-semibold text-muted-foreground text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPlatforms.map((platform, index) => (
                      <TableRow key={platform.id} className={index % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        <TableCell className="font-semibold text-foreground">{platform.name}</TableCell>
                        <TableCell>
                          <Badge variant={platform.enable ? "default" : "secondary"} className="font-medium">
                            {platform.enable ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">{platform.minimun_deposit} FCFA</TableCell>
                        <TableCell className="text-foreground">{platform.max_deposit} FCFA</TableCell>
                        <TableCell className="text-foreground">{platform.minimun_with} FCFA</TableCell>
                        <TableCell className="text-foreground">{platform.max_win} FCFA</TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {platform.city && platform.street ? `${platform.city}, ${platform.street}` : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(platform)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-gray-500/10 dark:hover:bg-white/10" onClick={() => handleDelete(platform)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ContentPagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                length={platforms.length}
                startIndex={startIndex}
                endIndex={endIndex}
                onChangePage={setCurrentPage}
              />
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">Aucune plateforme trouvée</div>
          )}
        </CardContent>
      </Card>

      <PlatformDialog open={dialogOpen} onOpenChange={setDialogOpen} platform={selectedPlatform} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Ceci supprimera définitivement la plateforme "{platformToDelete?.name}". Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-primary/10">Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deletePlatform.isPending ? (
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

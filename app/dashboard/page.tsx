"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Users,
    Network,
    ArrowLeftRight,
    Wallet,
    TrendingUp,
    Gift,
    Bot,
    Share2, Award, DollarSign, Megaphone, Ticket, UserPlus
} from "lucide-react"
import {useDashboardStats} from "@/hooks/useDashboardStats";
import {Table,TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {TransactionsChart} from "@/components/transactions-chart";
import {useEffect, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {UsersChart} from "@/components/users-chart";

export default function DashboardPage() {
    const { data, isLoading, isError } = useDashboardStats()

    const stats = data?.dashboard_stats
    const transactionsByApp = stats?.transactions_by_app ?? {}
    const networksCount = Object.keys(transactionsByApp).length
    const volume = data?.volume_transactions
    const userGrowth = data?.user_growth
    const referral = data?.referral_system
    const [volumeChart, setVolumeChart] = useState<{date: string
        type_trans: string
        total_amount: number
        count: number}[]>([])
    const [userChart, setUserChart] = useState<{
        date: string
        count: number
    }[]>([])
    const [volumePeriod, setVolumePeriod] = useState<"monthly"|"yearly"|"daily"|"weekly">("monthly")
    const [usersPeriod, setUsersPeriod] = useState<"monthly"|"daily"|"weekly">("monthly")

    useEffect(() => {
        if (!volume) return
        switch (volumePeriod){
            case "weekly":
                setVolumeChart(volume.evolution.weekly.map(
                    (v)=> {
                        return {
                            date: new Date(v.week).toLocaleDateString(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
                break
            case "monthly":
                setVolumeChart(volume.evolution.monthly.map(
                    (v)=> {
                        return {
                            date: new Date(v.month).toLocaleString("fr",{month:"long"}).toUpperCase(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
                break
            case "yearly":
                setVolumeChart(volume.evolution.yearly.map(
                    (v)=> {
                        return {
                            date:new Date(v.year).getFullYear().toString(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
                break
            case "daily":
                setVolumeChart(volume.evolution.daily.map(
                    (v)=> {
                        return {
                            date: new Date(v.date).toLocaleDateString(),
                            type_trans: v.type_trans,
                            total_amount: v.total_amount,
                            count: v.count,
                        }
                    }

                ))
        }

    },[volume,volumePeriod])

    useEffect(() => {
        if (!userGrowth) return
        switch (usersPeriod){
            case "weekly":
                setUserChart(userGrowth.new_users.weekly.map(
                    (v)=> {
                        return {
                            date: new Date(v.week).toLocaleDateString(),
                            count: v.count
                        }
                    }

                ))
                break
            case "monthly":
                setUserChart(userGrowth.new_users.monthly.map(
                    (v)=> {
                        return {
                            date: new Date(v.month).toLocaleString("fr",{month:"long"}).toUpperCase(),
                            count: v.count,
                        }
                    }

                ))
                break
            case "daily":
                setUserChart(userGrowth.new_users.daily.map(
                    (v)=> {
                        return {
                            date: new Date(v.date).toLocaleDateString(),
                            count: v.count,
                        }
                    }

                ))
        }

    },[userGrowth,usersPeriod])

    function formatNumber(value: number | undefined | null) {
        if (value === undefined || value === null || Number.isNaN(value)) return "-"
        return new Intl.NumberFormat("fr-FR").format(value)
    }

    function formatCurrency(value: number | undefined | null) {
        if (value === undefined || value === null || Number.isNaN(value)) return "-"
        return `${formatNumber(value)} FCFA`
    }



    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                    Tableau de Bord
                </h2>
                <p className="text-muted-foreground text-lg">Bienvenue sur le tableau de bord administrateur FASTXOF</p>
            </div>

            {isError && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                    Une erreur est survenue lors du chargement des statistiques.
                </div>
            )}

            {/* Main Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                        <div className="p-2 rounded-full bg-chart-1/20">
                            <Users className="h-4 w-4 text-chart-1" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatNumber(stats?.total_users)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.active_users)} actifs / ${formatNumber(stats?.inactive_users)} inactifs`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transactions Total</CardTitle>
                        <div className="p-2 rounded-full bg-chart-2/20">
                            <ArrowLeftRight className="h-4 w-4 text-chart-2" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatNumber(stats?.total_transactions)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "Chargement..." : "Toutes transactions confondues"}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Solde Net</CardTitle>
                        <div className="p-2 rounded-full bg-chart-3/20">
                            <Wallet className="h-4 w-4 text-chart-3" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatCurrency(volume?.net_volume)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading
                                ? "Chargement..."
                                : `${formatCurrency(volume?.deposits?.total_amount)} dépôts / ${formatCurrency(
                                    volume?.withdrawals?.total_amount,
                                )} retraits`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Bonus</CardTitle>
                        <div className="p-2 rounded-full bg-chart-4/20">
                            <Gift className="h-4 w-4 text-chart-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatCurrency(stats?.total_bonus)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading ? "Chargement..." : "Bonus distribués"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Rewards, Disbursements, Ads & Coupons */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Récompenses</CardTitle>
                        <div className="p-2 rounded-full bg-chart-5/20">
                            <Award className="h-4 w-4 text-chart-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatCurrency(stats?.rewards?.total)}
                        </div>
                        <p className="text-xs text-muted-foreground">Total des récompenses</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Décaissements</CardTitle>
                        <div className="p-2 rounded-full bg-chart-6/20">
                            <DollarSign className="h-4 w-4 text-chart-6" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatCurrency(stats?.disbursements?.amount)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.disbursements?.count)} décaissements`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Publicités</CardTitle>
                        <div className="p-2 rounded-full bg-chart-7/20">
                            <Megaphone className="h-4 w-4 text-chart-7" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatNumber(stats?.advertisements?.total)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.advertisements?.active)} actives`}
                        </p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Coupons</CardTitle>
                        <div className="p-2 rounded-full bg-chart-8/20">
                            <Ticket className="h-4 w-4 text-chart-8" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {isLoading ? "N/A" : formatNumber(stats?.coupons?.total)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {isLoading
                                ? "Chargement..."
                                : `${formatNumber(stats?.coupons?.active)} actifs`}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 justify-between">
                            <CardTitle>Evolution des transaction</CardTitle>
                            <Select defaultValue="daily" value={volumePeriod} onValueChange={(s)=>setVolumePeriod(s as "monthly"|"yearly"|"daily"|"weekly")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionner une période"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Aujourd'hui</SelectItem>
                                    <SelectItem value="weekly">Cette semaine</SelectItem>
                                    <SelectItem value="monthly">Ce mois</SelectItem>
                                    <SelectItem value="yearly">Cette année</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <TransactionsChart data={volumeChart}/>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2 justify-between">
                            <CardTitle>Evolution des utilisateurs</CardTitle>
                            <Select defaultValue="daily" value={usersPeriod} onValueChange={(s)=>setUsersPeriod(s as "monthly"|"daily"|"weekly")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selectionner une période"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">Aujourd'hui</SelectItem>
                                    <SelectItem value="weekly">Cette semaine</SelectItem>
                                    <SelectItem value="monthly">Ce mois</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </CardHeader>
                    <CardContent>
                        <UsersChart data={userChart}/>
                    </CardContent>
                </Card>
            </div>

            {/* Bot Statistics */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-chart-9/20">
                            <Bot className="h-5 w-5 text-chart-9" />
                        </div>
                        Statistiques Bot
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Transactions Bot</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : formatNumber(stats?.bot_stats?.total_transactions)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Dépôts Bot</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : formatNumber(stats?.bot_stats?.total_deposits)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Retraits Bot</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : formatNumber(stats?.bot_stats?.total_withdrawals)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Utilisateurs Bot</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : formatNumber(stats?.bot_stats?.total_users)}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Volume Transactions */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-chart-3/20">
                                <UserPlus className="h-5 w-5 text-chart-3" />
                            </div>
                            Utilisateurs
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Utilisateurs Actifs</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : formatNumber(userGrowth?.active_users_count)}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                                <p className="text-sm text-muted-foreground">Bloqués</p>
                                <p className="text-xl font-bold">
                                    {isLoading ? "N/A" : formatNumber(userGrowth?.status?.blocked)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Actifs</p>
                                <p className="text-xl font-bold">
                                    {isLoading ? "N/A" : formatNumber(userGrowth?.status?.active)}
                                </p>
                            </div>
                        </div>
                        <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground mb-2">Utilisateurs par Source</p>
                            <div className="space-y-1">
                                {userGrowth?.users_by_source?.map((source) => (
                                    <div key={source.source} className="flex justify-between text-sm">
                                        <span className="capitalize">{source.source}</span>
                                        <span className="font-medium">{formatNumber(source.count)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-chart-2/20">
                                <Share2 className="h-5 w-5 text-chart-2" />
                            </div>
                            Système de Parrainage
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Parrainages</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : formatNumber(referral?.parrainages_count)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Bonus de Parrainage Total</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : formatCurrency(referral?.total_referral_bonus)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Taux d'Activation</p>
                            <p className="text-2xl font-bold">
                                {isLoading ? "N/A" : `${formatNumber(referral?.activation_rate)}%`}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Growth & Referral */}
            {/*


            */}



            {/* Transactions by App */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <div className="p-2 rounded-full bg-chart-3/20">
                            <Network className="h-5 w-5 text-chart-3" />
                        </div>
                        Transactions par Application ({networksCount})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-sm text-muted-foreground">Chargement...</p>
                    ) : Object.keys(transactionsByApp).length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune transaction par application</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Application</TableHead>
                                    <TableHead className="text-right">Nombre</TableHead>
                                    <TableHead className="text-right">Montant Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(transactionsByApp).map(([app, data]) => (
                                    <TableRow key={app}>
                                        <TableCell className="font-medium">{app}</TableCell>
                                        <TableCell className="text-right">{formatNumber(data.count)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(data.total_amount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

        </div>
    )
}
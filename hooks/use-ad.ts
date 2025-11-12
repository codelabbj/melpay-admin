import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/axios";
import {toast} from "react-hot-toast";

export type AdInput = {
    image: File;
    enable:boolean
}

export function useAd() {
    return useQuery({
        queryKey:["ads"],
        queryFn: async () => {
            const res = await api.get<String[]>('/mobcash/ann')
            return res.data
        }
    })
}

export function useCreateAd(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: AdInput) => {
            const query = new FormData();
            query.append("image",data.image);
            query.append("enable",String(data.enable));
            const res = await api.post<string>('/mobcash/ann', query)
            return res.data
        },
        onSuccess: () =>{
            toast.success("Publicité crée avec succès")
            queryClient.invalidateQueries({queryKey:["ads"]})
        }
    })
}

export function useUpdateAd() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async ({id,enabled}:{id:number,enabled:boolean}) => {
            const res = await api.put<string>(`/mobcash/ann/${id}`,{enable:enabled})
            return res.data
        },
        onSuccess: () =>{
            toast.success("Publicité mis à jour avec succès")
            queryClient.invalidateQueries({queryKey:["ads"]})
        }
    })
}

export function useDeleteAd() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id:number) => {
            const res = await api.delete<string>(`/mobcash/ann/${id}`)
        },
        onSuccess: () =>{
            toast.success("Publicité supprimée avec succès")
            queryClient.invalidateQueries({queryKey:["ads"]})
        }
    })
}
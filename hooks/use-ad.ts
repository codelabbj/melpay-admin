import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/axios";
import {toast} from "react-hot-toast";
import {Paginated} from "@/lib/types";

export type Ad = {
    id: number;
    image: string;
    enable: boolean;
}

export type File = {
    id: number;
    file: string;
}
export type AdInput = Omit<Ad, "id">;

export function useAd(page:number) {
    return useQuery({
        queryKey:["ads"],
        queryFn: async () => {
            const res = await api.get<Paginated<Ad>>('/mobcash/ann',{params:{page:page}})
            return res.data
        }
    })
}

export function useCreateAd(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (data: { image: File, enable: boolean }) => {
            const uploadData = new FormData();
            uploadData.append("file", data.image);
            const file = (await api.post<File>('/mobcash/upload', uploadData)).data;

            const query = {
                image: file.file,
                enable: data.enable,
            }
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
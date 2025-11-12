import {Network} from "@/hooks/useNetworks";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import api from "@/lib/axios";
import {toast} from "react-hot-toast";
import {Paginated} from "@/lib/types";

export interface Coupon {
    id: number
    code:string
    bet_app: string
    bet_app_details: Network
    created_at: string
}

export type CouponInput = Omit<Coupon, "id"|"created_at"|"bet_app_details">

export function useCoupon(page: number){
    return useQuery({
        queryKey:["coupons",page],
        queryFn: async () =>{
            const res = await api.get<Paginated<Coupon>>("/mobcash/coupon",({params:{page:page}}));
            return res.data
        }
    })
}

export function useCreateCoupon(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data : CouponInput) =>{
            const res = await api.post<Coupon>("/mobcash/coupon", data);
            return res.data
        },
        onSuccess: ()=>{
          toast.success("Coupon created successfully.");
          queryClient.invalidateQueries({queryKey:["coupons"]});
        }
    })
}

export function useUpdateCoupon(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({id,data}:{id:number, data:Partial<Coupon>}) =>{
            const res = await api.put<Coupon>(`/mobcash/coupon/${id}`, data);
            return res.data
        },
        onSuccess:()=>{
            toast.success("Coupon updated successfully.");
            queryClient.invalidateQueries({queryKey:["coupons"]});
        }
    })
}

export function useDeleteCoupon(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/mobcash/coupon/${id}`)
        },
        onSuccess: ()=>{
            toast.success("Coupon deleted successfully!")
            queryClient.invalidateQueries({queryKey:["coupons"]})
        }
    })
}
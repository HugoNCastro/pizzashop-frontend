import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { getManagerRestaurant, GetManagerRestaurantResponse } from "@/api/get-manager-restaurant";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfile } from "@/api/update-profile";
import { toast } from "sonner";

const storeProfileDialogSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable()
})

type StoreProfileSchema = z.infer<typeof storeProfileDialogSchema>


export function StoreProfileDialog() {
  const queryClient = useQueryClient()


  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagerRestaurant,
    staleTime: Infinity
  })

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<StoreProfileSchema>({
    resolver: zodResolver(storeProfileDialogSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? ''
    }
  })

  function updateManagedRestaurantCache({ description, name }: StoreProfileSchema) {
    const cached = queryClient.getQueryData<GetManagerRestaurantResponse>(['managed-restaurant'])

    if (cached) {
      queryClient.setQueryData<GetManagerRestaurantResponse>(['managed-restaurant'], {
        ...cached,
        name,
        description,
      })
    }

    return { cached }
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate({ description, name }) {
      const { cached } = updateManagedRestaurantCache({ name, description })

      return { previousProfile: cached }
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateManagedRestaurantCache(context.previousProfile)
      }
    }
  })

  async function handleUpdateProfile(data: StoreProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        description: data.description
      })

      toast.success("Perfil atualizado com sucesso!")
    } catch {
      toast.error("Perfil não atualizado, tente novamente!")
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Perfil da loja
        </DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="name">
              Nome
            </Label>
            <Input className="col-span-3" id="name" {...register('name')} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="description">
              Descrição
            </Label>
            <Textarea className="col-span-3 min-h-32 max-h-64" id="description" {...register('description')} />
          </div>

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="sucess" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

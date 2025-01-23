import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { getManagerRestaurant } from "@/api/get-manager-restaurant";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'

const storeProfileDialogSchema = z.object({
  name: z.string().min(1),
  description: z.string()
})

type storeProfileDialogSchema = z.infer<typeof storeProfileDialogSchema>


export function StoreProfileDialog() {


  const { data: managedRestaurant } = useQuery({
    queryKey: ['managed-restaurant'],
    queryFn: getManagerRestaurant
  })

  const { register, handleSubmit } = useForm<storeProfileDialogSchema>({
    resolver: zodResolver(storeProfileDialogSchema),
    values: {
      name: managedRestaurant?.name ?? '',
      description: managedRestaurant?.description ?? ''
    }
  })

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
      <form>
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
          <Button variant="ghost" type="button">
            Cancelar
          </Button>
          <Button type="submit" variant="sucess">
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

import { Search, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'

const ordersFiltersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.string().optional()
})

type OrderFilterSchema = z.infer<typeof ordersFiltersSchema>

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const orderId = searchParams.get('orderId')
  const customerName = searchParams.get('customerName')
  const status = searchParams.get('status')

  const { register, handleSubmit, control, reset } = useForm<OrderFilterSchema>({
    resolver: zodResolver(ordersFiltersSchema),
    defaultValues: {
      orderId: orderId ?? '',
      customerName: customerName ?? '',
      status: status ?? 'all'
    }
  })

  function handleFilter({ customerName, orderId, status }: OrderFilterSchema) {
    setSearchParams(state => {
      if (orderId) {
        state.set('orderId', orderId)
      } else {
        state.delete('orderId')
      }

      if (customerName) {
        state.set('customerName', customerName)
      } else {
        state.delete('customerName')
      }

      if (status) {
        state.set('status', status)
      } else {
        state.delete('status')
      }

      state.set('page', '1')

      return state
    })
  }

  function handleClearFilters() {
    setSearchParams(state => {
      state.delete('orderId')
      state.delete('customerName')
      state.delete('status')
      state.set('page', '1')

      return state
    })

    reset({
      customerName: '',
      orderId: '',
      status: ''
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFilter)} className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros: </span>
      <Input
        className="h-8 w-[320px]"
        placeholder="Id do pedido"
        {...register('orderId')}
      />
      <Input
        className="h-8 w-[320px]"
        placeholder="Nome do cliente"
        {...register('customerName')}
      />

      <Controller
        name='status'
        control={control}
        render={({ field: { name, onChange, value, disabled } }) => {
          return (
            <Select
              defaultValue="all"
              name={name}
              onValueChange={onChange}
              value={value}
              disabled={disabled}
            >
              <SelectTrigger className="h-8 w-[108px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
                <SelectItem value="processing">Em preparo</SelectItem>
                <SelectItem value="delivering">Em entrega</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          )
        }}
      >

      </Controller>

      <Button size="xs" variant="secondary" type="submit">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button size="xs" variant="outline" type="button" onClick={handleClearFilters}>
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  )
}

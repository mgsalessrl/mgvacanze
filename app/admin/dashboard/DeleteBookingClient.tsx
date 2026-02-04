'use client'

import { Trash2 } from 'lucide-react'
import { FormEvent } from 'react'

interface DeleteBookingClientProps {
  id: number
  deleteAction: (formData: FormData) => Promise<void>
}

export default function DeleteBookingClient({ id, deleteAction }: DeleteBookingClientProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    if (!confirm('Sei sicuro di voler eliminare definitivamente questa prenotazione?')) {
      e.preventDefault()
    }
  }

  return (
    <form action={deleteAction} onSubmit={handleSubmit}>
      <input type="hidden" name="id" value={id} />
      <button 
        type="submit"
        className="p-2 text-red-600 hover:bg-red-50 rounded-md" 
        title="Elimina definitivamente"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </form>
  )
}

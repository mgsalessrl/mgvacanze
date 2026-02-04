'use client'

import { useState, useMemo, useEffect } from 'react'
import { Plus, Trash2, FileText, Send, Loader2 } from 'lucide-react'
import { createQuote, getSuggestedPrice } from '../actions'

type Extra = {
  id?: string
  name: string
  price: number
  type: 'standard' | 'adhoc'
}

type BoatOption = {
  id: string
  name: string
  // could add base price hint here if we had pricing engine exposure
}

export default function QuoteForm({ standardExtras, boats }: { standardExtras: any[], boats: BoatOption[] }) {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Ad-Hoc inputs
  const [adHocName, setAdHocName] = useState('')
  const [adHocPrice, setAdHocPrice] = useState('')

  // Form State for live calculation
  const [price, setPrice] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed')

  // Live Pricing State
  const [selectedBoat, setSelectedBoat] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [suggestedInfo, setSuggestedInfo] = useState<{
      finalPrice: number, 
      originalPrice: number, 
      discount?: { name: string, amount: number }
  } | null>(null)
  const [isCalculatingPrice, setIsCalculatingPrice] = useState(false)

  // Fetch Recommended Price
  useEffect(() => {
    const fetchPrice = async () => {
      if (selectedBoat && startDate && endDate) {
        setIsCalculatingPrice(true)
        const result = await getSuggestedPrice(selectedBoat, startDate, endDate)
        // Adjust for return type change
        if (result && typeof result === 'object') {
             setSuggestedInfo(result);
        } else {
             setSuggestedInfo(null);
        }
        setIsCalculatingPrice(false)
      } else {
        setSuggestedInfo(null)
      }
    }
    
    // De-bounce slightly to avoid excessive calls
    const timeoutId = setTimeout(() => {
        fetchPrice()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [selectedBoat, startDate, endDate])

  const addStandardExtra = (id: string) => {
    if (!id) return
    const original = standardExtras.find(e => e.id === id)
    if (original) {
      setSelectedExtras([...selectedExtras, { 
        id: original.id, 
        name: original.name, 
        price: original.price, 
        type: 'standard' 
      }])
    }
  }

  const addAdHocExtra = () => {
    if (!adHocName || !adHocPrice) return
    setSelectedExtras([...selectedExtras, {
      name: adHocName,
      price: parseFloat(adHocPrice),
      type: 'adhoc'
    }])
    setAdHocName('')
    setAdHocPrice('')
  }

  const removeExtra = (index: number) => {
    const newExtras = [...selectedExtras]
    newExtras.splice(index, 1)
    setSelectedExtras(newExtras)
  }

  const totals = useMemo(() => {
    const extrasTotal = selectedExtras.reduce((acc, curr) => acc + curr.price, 0)
    let discountVal = discount
    if (discountType === 'percent') {
      discountVal = (price * discount) / 100
    }
    return {
      extrasTotal,
      discountVal,
      finalTotal: Math.max(0, price + extrasTotal - discountVal)
    }
  }, [price, selectedExtras, discount, discountType])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    // Add the complex JSON data
    formData.set('extras_json', JSON.stringify(selectedExtras))
    
    try {
      await createQuote(formData)
      alert('Preventivo inviato con successo!')
      // Reset or redirect?
      window.location.href = '/admin/dashboard'
    } catch (e: any) {
      alert('Errore: ' + e.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm">
      
      {/* 1. Dati Cliente */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="bg-primary/10 text-primary p-2 rounded-lg">1</span> Dati Cliente
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <input name="customer_name" required className="w-full border rounded-md p-2" placeholder="Marco Rossi" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="customer_email" type="email" required className="w-full border rounded-md p-2" placeholder="marco@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefono</label>
            <input name="customer_phone" className="w-full border rounded-md p-2" placeholder="+39 333..." />
          </div>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* 2. Dettagli Noleggio */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           <span className="bg-primary/10 text-primary p-2 rounded-lg">2</span> Dettagli Noleggio
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Seleziona Imbarcazione</label>
            <select 
                name="boat_name" 
                required 
                className="w-full border rounded-md p-2"
                onChange={(e) => setSelectedBoat(e.target.value)}
            >
              <option value="">-- Seleziona --</option>
              {boats.map(b => (
                 <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inizio</label>
            <input 
                name="start_date" 
                type="date" 
                required 
                className="w-full border rounded-md p-2" 
                onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Fine</label>
            <input 
                name="end_date" 
                type="date" 
                required 
                className="w-full border rounded-md p-2" 
                onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Numero Ospiti</label>
             <input name="guests" type="number" min="1" className="w-full border rounded-md p-2" />
          </div>
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* 3. Prezzi & Servizi */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           <span className="bg-primary/10 text-primary p-2 rounded-lg">3</span> Prezzi e Servizi
        </h2>
        
        <div className="mb-6">
           <label className="block text-sm font-medium text-gray-700 mb-1">Prezzo Noleggio (€)</label>
           
           {/* Price Hint */}
           <div className="mb-2 h-auto min-h-[1.5rem]">
             {isCalculatingPrice ? (
                 <span className="text-xs text-gray-400 flex items-center gap-1 animate-pulse">
                     <Loader2 className="w-3 h-3 animate-spin"/> Calcolo prezzo listino...
                 </span>
             ) : suggestedInfo && suggestedInfo.finalPrice > 0 ? (
                 <div className="flex flex-col gap-1 items-start">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-flex items-center gap-1">
                        💡 Listino: <strong>€ {suggestedInfo.finalPrice.toLocaleString('it-IT')}</strong>
                        {suggestedInfo.discount && (
                            <span className="text-green-600 ml-1">
                                (Include {suggestedInfo.discount.name}: -€{suggestedInfo.discount.amount.toLocaleString()})
                            </span>
                        )}
                    </span>
                    {suggestedInfo.discount && (
                        <span className="text-[10px] text-gray-500 ml-1">
                            Prezzo Originale: <span className="line-through">€ {suggestedInfo.originalPrice.toLocaleString()}</span>
                        </span>
                    )}
                 </div>
             ) : suggestedInfo?.finalPrice === 0 && selectedBoat && startDate && endDate ? (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded inline-flex items-center gap-1">
                    ⚠️ Nessun prezzo di listino per queste date (Fuori Stagione o Durata non valida)
                </span>
             ) : (
                 <span className="text-xs text-gray-400">Seleziona barca e date per vedere il listino</span>
             )}
           </div>

           <input 
             name="rental_price" 
             type="number" 
             step="0.01" 
             required 
             className="w-full border rounded-md p-2 text-lg font-semibold" 
             placeholder="0.00"
             onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
           />
        </div>

        {/* Extras Selection */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">Aggiungi Servizi Extra</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
             {/* Standard Extras Dropdown */}
             <div className="md:col-span-1">
                <label className="text-xs text-gray-500 block mb-1">Da Catalogo</label>
                <select 
                  className="w-full border rounded-md p-2 text-sm"
                  onChange={(e) => {
                     addStandardExtra(e.target.value);
                     e.target.value = ''; // reset
                  }}
                >
                  <option value="">Seleziona...</option>
                  {standardExtras.map(e => <option key={e.id} value={e.id}>{e.name} (+€{e.price})</option>)}
                </select>
             </div>

             {/* Ad Hoc Inputs */}
             <div className="md:col-span-2 flex gap-2 items-end">
                <div className="flex-1">
                   <label className="text-xs text-gray-500 block mb-1">Nome Servizio Custom</label>
                   <input 
                      value={adHocName}
                      onChange={e => setAdHocName(e.target.value)}
                      placeholder="..." 
                      className="w-full border rounded-md p-2 text-sm" 
                    />
                </div>
                <div className="w-24">
                   <label className="text-xs text-gray-500 block mb-1">Prezzo</label>
                   <input 
                      type="number" 
                      value={adHocPrice}
                      onChange={e => setAdHocPrice(e.target.value)}
                      placeholder="0" 
                      className="w-full border rounded-md p-2 text-sm" 
                    />
                </div>
                <button 
                  type="button"
                  onClick={addAdHocExtra}
                  className="bg-gray-800 text-white p-2 rounded-md hover:bg-black"
                >
                  <Plus size={20} />
                </button>
             </div>
          </div>

          {/* Selected List */}
          {selectedExtras.length > 0 && (
            <ul className="space-y-2">
              {selectedExtras.map((extra, idx) => (
                <li key={idx} className="flex justify-between items-center bg-white p-2 rounded border shadow-sm">
                   <span className="text-sm">
                      {extra.name} 
                      {extra.type === 'adhoc' && <span className="ml-2 px-1 bg-yellow-100 text-yellow-800 text-[10px] rounded uppercase">Custom</span>}
                   </span>
                   <div className="flex items-center gap-3">
                      <span className="font-medium">€ {extra.price.toFixed(2)}</span>
                      <button type="button" onClick={() => removeExtra(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 size={16} />
                      </button>
                   </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Discount */}
        <div className="grid grid-cols-2 gap-4 mb-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Sconto</label>
             <input 
                name="discount" 
                type="number" 
                step="0.01" 
                className="w-full border rounded-md p-2" 
                placeholder="0"
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
             />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Tipo Sconto</label>
             <select 
                name="discount_type" 
                className="w-full border rounded-md p-2"
                onChange={(e) => setDiscountType(e.target.value as any)}
             >
                <option value="fixed">Fisso (€)</option>
                <option value="percent">Percentuale (%)</option>
             </select>
           </div>
        </div>

        {/* Totals Summary */}
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
           <div className="flex justify-between text-sm mb-1">
              <span>Importo Noleggio:</span>
              <span>€ {price.toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-sm mb-1">
              <span>Extra:</span>
              <span>€ {totals.extrasTotal.toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-sm mb-2 text-red-600">
              <span>Sconto:</span>
              <span>- € {totals.discountVal.toFixed(2)}</span>
           </div>
           <div className="border-t border-primary/20 pt-2 flex justify-between font-bold text-lg text-primary">
              <span>Totale Preventivo:</span>
              <span>€ {totals.finalTotal.toFixed(2)}</span>
           </div>
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end pt-4">
        <button 
          type="button" 
          onClick={() => window.history.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-600 hover:bg-gray-50"
        >
          Annulla
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          {isSubmitting ? (
             <span className="animate-pulse">Invio in corso...</span>
          ) : (
             <>
               <Send size={20} />
               Invia Preventivo via Email
             </>
          )}
        </button>
      </div>
    </form>
  )
}

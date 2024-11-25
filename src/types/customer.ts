import type { ClientData, CUSTOMER_DATA_STATUS, Document } from "@/components/Painel/Document/Detail/DocumentsDetails"

export type Customer = {
    id: number
    baseId: number
    data: ClientData
    documents: Document[]
    userId: number
    status: string
    dataStatus: CUSTOMER_DATA_STATUS
    dataObservation: string
    statusUpdatedAt: string
    sendedAt: string
    createdAt: string
    updatedAt: string
  }
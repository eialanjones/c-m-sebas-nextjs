import type { ClientData, Document } from "@/components/Painel/Document/Detail/DocumentsDetails"

export type Customer = {
    id: number
    baseId: number
    data: ClientData
    documents: Document[]
    userId: number
    status: string
    statusUpdatedAt: string
    sendedAt: string
    createdAt: string
    updatedAt: string
  }
export type Customer = {
    id: number
    baseId: number
    data: Record<string, string>
    documents: Record<string, string>
    userId: number
    status: string
    lastStatusUpdatedAt: string
    sendedAt: string
    createdAt: string
    updatedAt: string
  }
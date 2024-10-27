"use client"

import { useState, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Eye, Filter, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

type Document = {
  id: number
  name: string
  requestDate: Date
  sendDate: Date
  timeInStatus: string
  status: string
}

const initialDocuments: Document[] = [
  {
    id: 1,
    name: "João Silva",
    requestDate: new Date("2023-05-01"),
    sendDate: new Date("2023-05-02"),
    timeInStatus: "1 dia",
    status: "Documentos Pendentes"
  },
  {
    id: 2,
    name: "Maria Santos",
    requestDate: new Date("2023-05-03"),
    sendDate: new Date("2023-05-04"),
    timeInStatus: "2 dias",
    status: "Em Processamento"
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    requestDate: new Date("2023-05-05"),
    sendDate: new Date("2023-05-07"),
    timeInStatus: "3 dias",
    status: "Concluído"
  },
]

type FilterState = {
  name: string
  requestDate: Date | null
  sendDate: Date | null
  timeInStatus: string
  status: string[]
}

export default function AdvancedDocumentTable() {
  const [documents] = useState<Document[]>(initialDocuments)
  const [filters, setFilters] = useState<FilterState>({
    name: '',
    requestDate: null,
    sendDate: null,
    timeInStatus: '',
    status: []
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      (!filters.requestDate || doc.requestDate.toDateString() === filters.requestDate.toDateString()) &&
      (!filters.sendDate || doc.sendDate.toDateString() === filters.sendDate.toDateString()) &&
      doc.timeInStatus.toLowerCase().includes(filters.timeInStatus.toLowerCase()) &&
      (filters.status.length === 0 || filters.status.includes(doc.status))
    )
  }, [documents, filters])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredDocuments.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage)

  const handleFilterChange = (key: keyof FilterState, value: string | Date | string[] | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const statusOptions = Array.from(new Set(documents.map(doc => doc.status)))

  const router = useRouter();

  return (
    <Card className="p-6">
      <h2 className="mb-4">Processos Recentes</h2>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Filtrar por nome..."
          value={filters.name}
          onChange={(e) => handleFilterChange('name', e.target.value)}
          className="max-w-xs"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.requestDate ? format(filters.requestDate, "PPP") : <span>Data de Solicitação</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.requestDate as Date}
              onSelect={(date) => handleFilterChange('requestDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.sendDate ? format(filters.sendDate, "PPP") : <span>Data de Envio</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.sendDate as Date}
              onSelect={(date) => handleFilterChange('sendDate', date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          type="text"
          placeholder="Filtrar por tempo no status..."
          value={filters.timeInStatus}
          onChange={(e) => handleFilterChange('timeInStatus', e.target.value)}
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <span>Filtrar por Status</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {statusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={filters.status.includes(status)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleFilterChange('status', [...filters.status, status])
                  } else {
                    handleFilterChange('status', filters.status.filter(s => s !== status))
                  }
                }}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Detalhes</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Data de Solicitação</TableHead>
            <TableHead>Data de Envio</TableHead>
            <TableHead>Tempo nesse status</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => {
                  router.push(`/painel/processo/${doc.id}`);
                }}>
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{format(doc.requestDate, "dd/MM/yyyy")}</TableCell>
              <TableCell>{format(doc.sendDate, "dd/MM/yyyy")}</TableCell>
              <TableCell>{doc.timeInStatus}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${doc.status === 'Documentos Pendentes' ? 'bg-yellow-200 text-yellow-800' :
                    doc.status === 'Em Processamento' ? 'bg-blue-200 text-blue-800' :
                    'bg-green-200 text-green-800'}`}>
                  {doc.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredDocuments.length)} de {filteredDocuments.length} entradas
        </p>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      </div>
    </Card>
  )
}
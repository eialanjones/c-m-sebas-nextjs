import { PainelCard } from "@/components/Painel/Card"
import AdvancedDocumentTable from "@/components/Painel/DocumentTable"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Clock, ClockAlert, Eye, FileMinus } from "lucide-react"

export default function Dashboard() {
  return (
      <SidebarInset className="w-full">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Painel
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                {/* <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-4">
            <PainelCard title="Fim de SLA" icon={<Clock className="size-4" />}>
              <div className="text-2xl font-bold">12</div>
            </PainelCard>
            <PainelCard title="Pendente de Analise" icon={<Eye className="size-4" />}>
              <div className="text-2xl font-bold">12</div>
            </PainelCard>
            <PainelCard title="Prazo de Analise Vencidos" icon={<ClockAlert className="size-4" />}>
              <div className="text-2xl font-bold">12</div>
            </PainelCard>
            <PainelCard title="Pendente de Documentos" icon={<FileMinus className="size-4" />}>
              <div className="text-2xl font-bold">12</div>
            </PainelCard>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <AdvancedDocumentTable />
          </div>
        </div>
      </SidebarInset>
  )
}

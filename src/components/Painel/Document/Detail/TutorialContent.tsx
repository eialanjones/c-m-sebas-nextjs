"use client";

export function TutorialContent() {
  return (
    <div className="space-y-6 pr-4">
      <h3 className="text-xl font-semibold mb-4">Como enviar seus documentos</h3>
      
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">1. Preenchimento dos Dados</h4>
          <p className="text-sm text-muted-foreground">
            Preencha todos os campos solicitados com suas informações pessoais. Todos os campos são obrigatórios.
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">2. Upload de Documentos</h4>
          <p className="text-sm text-muted-foreground">
            Para cada documento solicitado:
            - Digitalize ou fotografe o documento
            - Certifique-se que está legível
            - Clique na área de upload ou arraste o arquivo
            - Aguarde o upload completar
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">3. Revisão e Envio</h4>
          <p className="text-sm text-muted-foreground">
            - Verifique se todos os documentos foram enviados corretamente
            - Clique em "Salvar" após cada upload
            - No último documento, clique em "Finalizar Envio"
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg border-l-4 border-yellow-500">
          <h4 className="font-medium mb-2">Importante</h4>
          <p className="text-sm text-muted-foreground">
            - Mantenha seus documentos originais
            - Você poderá ser solicitado a fazer correções
            - Em caso de dúvidas, entre em contato com o suporte
          </p>
        </div>
      </div>
    </div>
  );
}
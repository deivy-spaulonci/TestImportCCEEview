import { Component } from '@angular/core';
import { FileUpload } from './model/file-upload';
import { AgenteService } from './service/agente.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TesteImportCCEEview';
  selectedFiles:FileList;
  myFiles:FileUpload[]=[];
  fileIndex = 0;
  uploadConcluido:boolean=false;
  loading = false;

  constructor(private agenteService: AgenteService) {
  }

  selectFile(event: any) {
    this.myFiles = [];
    if (event.target.files.length == 0) {
      console.log("Nenhum arquivo anexado!");
      return
    }
    this.selectedFiles = event.target.files;

    for (var i = 0; i < event.target.files.length; i++) {
      this.myFiles.push(event.target.files[i]);
      this.myFiles[i].icone = "cloud_upload";
      this.myFiles[i].status = "Pronto para envio";
    }
  }

  reset(){
    this.uploadConcluido=false;
    this.fileIndex = 0;
    this.loading = false;
    this.myFiles = [];
  }

  async upload(){

    if(this.selectedFiles && this.selectedFiles.length > 0){
      this.loading = true;
      var file:any = this.selectedFiles.item(this.fileIndex);
      this.myFiles[this.fileIndex].icone = "sync";
      this.myFiles[this.fileIndex].status = "importando...";


      this.agenteService.importAgente(file).subscribe({
        next: (event: any) => {
          this.myFiles[this.fileIndex].icone = "done";
          this.myFiles[this.fileIndex].status = "Arquivo importado!";
        },
        error: (err: any) => {
          console.log(JSON.stringify(err));
          this.myFiles[this.fileIndex].icone = "report";
          this.myFiles[this.fileIndex].status = "Erro na importação.";
        },
        complete: () => {
          if(this.fileIndex < this.selectedFiles.length-1){
            this.fileIndex = this.fileIndex+1;
            this.upload();
          }else{
            this.uploadConcluido=true;
            this.loading = false;
          }
        }
      });
    }
  }

}

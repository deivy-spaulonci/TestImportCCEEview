import { Component, ElementRef, ViewChild } from '@angular/core';
import { FileUpload } from './model/file-upload';
import { AgenteService } from './service/agente.service';
import { Observable } from 'rxjs';

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

      await this.agenteService.importAgente(file).subscribe({
        next: (event: any) => {          
          this.myFiles[this.fileIndex].icone = "done";
          this.myFiles[this.fileIndex].status = "Arquivo importado!";
        },
        error: (err: any) => {          
          this.myFiles[this.fileIndex].icone = "emergency_home";
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
      })
    }

  

    // this.progress = 0;

    // if (this.selectedFiles) {
    //   const file: File | null = this.selectedFiles.item(0);

    //   if (file) {
    //     this.currentFile = file;

    //     this.agenteService.importAgente(null).subscribe({
    //       next: (event: any) => {
    //         // if (event.type === HttpEventType.UploadProgress) {
    //         //   this.progress = Math.round(100 * event.loaded / event.total);
    //         // } else if (event instanceof HttpResponse) {
    //         //   this.message = event.body.message;
    //         //   this.fileInfos = this.uploadService.getFiles();
    //         // }
    //         alert("importado sucesso")
    //       },
    //       error: (err: any) => {
    //         // console.log(err);
    //         // this.progress = 0;

    //         // if (err.error && err.error.message) {
    //         //   this.message = err.error.message;
    //         // } else {
    //         //   this.message = 'Could not upload the file!';
    //         // }

    //         // this.currentFile = undefined;
    //         alert("importado erro")
    //       }
    //     });
    //   }

    //   this.selectedFiles = undefined;
    // }


    // this.agenteService.importAgente(null).subscribe({
    //   next: resultado =>{
    //     //this.messageService.add({severity: 'info', summary: 'Sucesso', detail: 'Despesa salva com sucesso'});
    //     alert("importado sucesso")
    //   },
    //   error: error =>{
    //     alert("importado erro")
    //     console.log(JSON.stringify(error))
    //     // this.loading = false;
    //     // this.messageService.add({severity: 'error', summary: 'Erro', detail: error.message});
    //   },
    //   complete: () => {
    //     alert("importado completado")
    //   }
    // });
  }

}

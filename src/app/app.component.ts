import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExceljsService } from './services/exceljs.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Malofsito';
  excelData: { [key: string]: any[] } = {};

  private exceljsService = inject(ExceljsService);

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.exceljsService.readExcel(event).subscribe((data) => {
        this.excelData = data;
        console.log(this.excelData);

        for(const column in this.excelData){
          if(this.excelData.hasOwnProperty(column)){
            console.log(`Datos de la columna ${column}: `, this.excelData[column])
          }
        }
      });
    }
  }
}

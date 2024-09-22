import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import { Observable, from } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExceljsService {
  readExcel(event: any): Observable<{ [key: string]: any[] }> {
    const workbook = new ExcelJS.Workbook();
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const arrayBuffer = new Response(target.files[0]).arrayBuffer();
    return from(arrayBuffer).pipe(
      switchMap((data) => from(workbook.xlsx.load(data))),
      map((workbook) => {
        const worksheet = workbook.getWorksheet(1);
        const determinedColumns: { [key: string]: any[] } = {};

        worksheet!.eachRow((row, rowNumber) => {
          if (rowNumber === 1) {
            // Asumimos que la primera fila contiene los nombres de las columnas
            if (Array.isArray(row.values)) {
              row.values.forEach((value, index) => {
                if (index > 0) {
                  determinedColumns[`column${index}`] = [];
                }
              });
            } else {
              Object.values(row.values).forEach((value, index) => {
                if (index > 0) {
                  determinedColumns[`column${index}`] = [];
                }
              });
            }
          } else {
            if (Array.isArray(row.values)) {
              row.values.forEach((value, index) => {
                if (index > 0) {
                  if (!determinedColumns[`column${index}`]) {
                    determinedColumns[`column${index}`] = [];
                  }
                  determinedColumns[`column${index}`].push(value);
                }
              });
            } else {
              Object.values(row.values).forEach((value, index) => {
                if (index > 0) {
                  if (!determinedColumns[`column${index}`]) {
                    determinedColumns[`column${index}`] = [];
                  }
                  determinedColumns[`column${index}`].push(value);
                }
              });
            }
          }
        });

        return determinedColumns;
      })
    );
  }
}

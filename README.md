# Project Name

## Project Overview

Provide a brief description of your project, its purpose, and its main features.

## Installation

To install the project dependencies, run the following command:

```bash
npm install
```

## Usage

Provide instructions on how to use the project. Include examples if necessary.

### Running the Project

To start the project, run the following command:

```bash
ng serve
```

Then, open your browser and navigate to `http://localhost:4200`.

### Replacing Angular Material Tables with PrimeNG Tables

This project uses PrimeNG tables instead of Angular Material tables. To replace Angular Material tables with PrimeNG tables, follow these steps:

1. Install PrimeNG and its dependencies:

   ```bash
   npm install primeng primeicons @angular/cdk
   ```

2. Update your Angular module files to import PrimeNG modules. For example, in `app.module.ts`:

   ```typescript
   // filepath: d:\Work\FreeLance\importProject\src\app\app.module.ts
   import { TableModule } from "primeng/table";
   // ...existing code...

   @NgModule({
     declarations: [
       // ...existing code...
     ],
     imports: [
       // ...existing code...
       TableModule,
       // ...existing code...
     ],
     providers: [],
     bootstrap: [AppComponent],
   })
   export class AppModule {}
   ```

3. Replace Angular Material table components with PrimeNG table components in your templates. For example, in `example.component.html`:

   ```html
   <!-- filepath: d:\Work\FreeLance\importProject\src\app\example\example.component.html -->
   <!-- Replace Angular Material table with PrimeNG table -->
   <p-table [value]="data">
     <ng-template pTemplate="header">
       <tr>
         <th *ngFor="let col of columns">{{ col.header }}</th>
       </tr>
     </ng-template>
     <ng-template pTemplate="body" let-rowData>
       <tr>
         <td *ngFor="let col of columns">{{ rowData[col.field] }}</td>
       </tr>
     </ng-template>
   </p-table>
   ```

4. Ensure that your TypeScript code is compatible with PrimeNG tables. For example, in `example.component.ts`:

   ```typescript
   // filepath: d:\Work\FreeLance\importProject\src\app\example\example.component.ts
   import { Component, OnInit } from "@angular/core";

   @Component({
     selector: "app-example",
     templateUrl: "./example.component.html",
     styleUrls: ["./example.component.css"],
   })
   export class ExampleComponent implements OnInit {
     data: any[];
     columns: any[];

     ngOnInit() {
       this.columns = [
         { field: "name", header: "Name" },
         { field: "age", header: "Age" },
         // ...existing code...
       ];

       this.data = [
         { name: "John", age: 25 },
         { name: "Jane", age: 30 },
         // ...existing code...
       ];
     }
   }
   ```

## License

Include the license information for your project.

import { Injectable } from "@angular/core";
import { catchError, map  } from 'rxjs/operators';
import { Document } from './document.model';
//import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { Subject, throwError } from 'rxjs';

import { HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({providedIn:'root'})

export class DocumentService {

   

  documents: Document[] = [];
  documentSelectedEvent = new Subject<Document>();
  documentListChangedEvent = new Subject <Document[]>();
  startedEditing = new Subject<number>();
  maxDocumentId:number;
  error = new Subject<string>();

  

  constructor(private http:HttpClient) { 
   this.maxDocumentId = this.getMaxId();
 }


 sortDocuments(){
   this.documents =this.documents.sort((a, b) => {
      if (a['name'] > b['name']) {
      return 1;
      } else {
      return -1; 
      }});
 }

 
 

  getDocuments(){
     // return this.documents.slice();
   //return this.http.get<Document[]>('https://cms430-456bf-default-rtdb.firebaseio.com/documents.json')
   
   return this.http.get<{message:string, document:any}>('http://localhost:3000/documents')
   .pipe(map((responseData)=>{
         this.documents = responseData.document;
         this.maxDocumentId = this.getMaxId();
         this.sortDocuments();


         this.documentListChangedEvent.next(this.documents.slice());
         
         return this.documents;

     
    }), catchError(errorRes =>{
        return throwError(errorRes);
    })
    );


}






  getDocument(index:number){
     return this.documents[index];
    }




    deleteDocument(document: Document) {

      if (!document) {
        return;
      }
  
      const pos = this.documents.findIndex(d => d.id === document.id);

      if (pos < 0) {
        return;
      }
  
      // delete from database
      this.http.delete('http://localhost:3000/documents/' + document.id)
        .subscribe(() => {
          this.sortDocuments();
            this.documents.splice(pos, 1);
            this.documentListChangedEvent.next(this.documents.slice());
           
          }
        );
    }
   
getMaxId(): number {

   let maxId = 0;

   for(let document of this.documents){
      const currentId  = parseInt(document.id);
      if(currentId > maxId){
         maxId = currentId;
      }
   }
   return maxId
}



addDocument(document: Document) {
   if (!document) {
     return;
   }

   // make sure id of the new Document is empty
   document.id = '';

   const headers = new HttpHeaders({'Content-Type': 'application/json'});

   // add to database
   this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
     document,
     { headers: headers })
     .subscribe(
       (responseData) => {
         // add new document to documents
         this.sortDocuments();
         this.documents.push(responseData.document);
         let documentsListClone = this.documents.slice();
         this.documentListChangedEvent.next(documentsListClone);

        
       }
     );
 }


 updateDocument(originalDocument: Document, newDocument: Document) {
   if (!originalDocument || !newDocument) {
     return;
   }

   const pos = this.documents.findIndex(d => d.id === originalDocument.id);

   if (pos < 0) {
     return;
   }

   // set the id of the new Document to the id of the old Document
      newDocument.id = originalDocument.id;
      this.documents[pos] = newDocument;

   const headers = new HttpHeaders({'Content-Type': 'application/json'});

   // update database
   this.http.put('http://localhost:3000/documents/' + originalDocument.id,
     newDocument, { headers: headers })
     .subscribe(() => {
         

        this.sortDocuments();
         let documentsListClone = this.documents.slice();
         this.documentListChangedEvent.next(documentsListClone);
         
        
       }
     );
 }


 storesend(){
  this.documentListChangedEvent.next(this.documents.slice())
 }


 
}

    







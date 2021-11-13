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
   //this.documents=MOCKDOCUMENTS;

   // this.getDocuments().subscribe(docs=>{
   //    this.documents = docs;
   //    //console.log('constructor', docs);
   // })

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
   return this.http.get<Document[]>('https://cms430-456bf-default-rtdb.firebaseio.com/documents.json')
   .pipe(map((responseData)=>{
         this.documents = responseData;
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
      const pos = this.documents.indexOf(document);
      if (pos < 0) {
         return;
      }
      this.documents.splice(pos, 1);
      let documentsListClone = this.documents.slice();
      this.documentListChangedEvent.next(documentsListClone);
      this.storeDocuments();
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

addDocument(newDocument: Document): void {
   if (!newDocument) {
      return;
    }
   this.maxDocumentId++;
   newDocument.id = this.maxDocumentId.toString();

   // console.log('get last id',newDocument.id);
   this.documents.push(newDocument);
   this.sortDocuments();
   let documentsListClone = this.documents.slice();
   this.documentListChangedEvent.next(documentsListClone);
   this.storeDocuments();



}


updateDocument(originalDocument: Document, newDocument: Document) {

   if(!originalDocument || !newDocument ){
      return;
   }
   let pos = this.documents.indexOf(originalDocument);
   if (pos < 0){
      return;
   } 

      newDocument.id = originalDocument.id;
      this.documents[pos] = newDocument;


      //PATCH
      
      let documentsListClone = this.documents.slice();
      this.documentListChangedEvent.next(documentsListClone);
      this.storeDocuments();

}



storeDocuments(){

   const docJson = JSON.stringify(this.documents);
   const httpParam = {
     headers: new HttpHeaders({
       'Content-Type': 'application/json',
     })
   }
   this.http.put<Document[]>('https://cms430-456bf-default-rtdb.firebaseio.com/documents.json', docJson, httpParam)
     .subscribe(() => {
         this.sortDocuments();
         this.documentListChangedEvent.next(this.documents.slice())
   });
 }

 
}

    







import { Injectable } from '@angular/core';
import { Document } from './document.model';
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { EventEmitter } from '@angular/core';


export class DocumentService {
  documents: Document[] = [];

  documentSelectedEvent = new EventEmitter<Document>();


  
 documentChangedEvent: EventEmitter<Document[]> = new EventEmitter<Document[]>();



  constructor() { 
    this.documents=MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
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
      this.documentChangedEvent.emit(this.documents.slice());
   }

    


//   getDocument(id: string): Document | null {
//     for (const document of this.documents) {
//     if (document.id === id) {
//       return document;
//     }
//   }
//   return null;
// }





}

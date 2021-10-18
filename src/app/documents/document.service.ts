import { Injectable } from '@angular/core';
import { Document } from './document.model';
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { EventEmitter } from '@angular/core';


export class DocumentService {
  documents: Document[] = [];

  documentSelectedEvent = new EventEmitter<Document>();


  constructor() { 
    this.documents=MOCKDOCUMENTS;
  }

  getDocuments(): Document[] {
    return this.documents.slice();
  }


  getDocument(id: string): Document | null {
    for (const document of this.documents) {
    if (document.id === id) {
      return document;
    }
  }
  return null;
}





}
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Document } from '../document.model';


@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent: EventEmitter<Document> = new EventEmitter<Document>();

  documents: Document[] = [
    new Document('0', 'CIT 260 - Object Oriented Programming', 'In this course you will learn OOP', 'https://www.byui.edu/'),
    new Document('1', 'CIT 366 - Full Web Stack Development', 'Learn MEAN Stack.', 'https://www.byui.edu/'),
    new Document('2', 'CIT 425 - Data Warehousing', 'Learn Database.', 'https://www.byui.edu/'),
    new Document('3', 'CIT 460 - Enterprise Development', 'Learn Different technologies use in Companies', 'https://www.byui.edu/'),
    new Document('4', 'CIT 495 - Senior Practicum', 'Intern and OJT in a company that suites your need', 'https://www.byui.edu/'),
  ];

  constructor() { }

  ngOnInit(): void {
  }

  onSelectedDocument(document: Document){
    this.selectedDocumentEvent.emit(document);
  }

}
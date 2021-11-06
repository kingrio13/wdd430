import { Component,OnDestroy,OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { WindRefService } from 'src/app/wind-ref.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit, OnDestroy {
 document: Document;
 id:number;
 nativeWindow:any;
 private docChanged:Subscription;



  constructor(private documentService:DocumentService,
              private route:ActivatedRoute,
              private router:Router,
              private windowRefService:WindRefService) {
                  this.nativeWindow=windowRefService.getNativeWindow();
               }

  ngOnInit(){


      this.docChanged = this.route.params.subscribe(
        (params:Params)=>{
          this.id = +params['id'];
          this.document  = this.documentService.getDocument(this.id);
        })  
      
      
}


  onEditDocument(){
    this.router.navigate(['edit'], {relativeTo:this.route});
  }

  onView(){
      if(this.document.url){
        this.nativeWindow.open(this.document.url);
      }
  }

  
  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['/documents']);
 }

 ngOnDestroy(){
    this.docChanged.unsubscribe;
 }


}
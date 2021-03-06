import { Route } from '@angular/compiler/src/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit, OnDestroy {
  contact: Contact;
  id:number;
  private contactChange:Subscription;

  constructor( private contactService:ContactService,
                private route:ActivatedRoute,
                private router:Router,
              ) { }



  ngOnInit(): void {

    this.contactChange = this.route.params.subscribe(
      (params:Params)=>{
        this.id = +params['id'];
        this.contact = this.contactService.getContactindex(this.id);

        // console.log('read this',this.contact);
      })

     
  }

  onEditContact(){
    this.router.navigate(['edit'], {relativeTo:this.route});
  }

  onDeleteContact() {
    this.contactService.deleteContact(this.contact)
    this.router.navigate(['/contacts']);
 }

 ngOnDestroy(){
   this.contactChange.unsubscribe();
 }
  

}

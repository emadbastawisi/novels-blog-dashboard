import { Component, OnInit } from '@angular/core';
import { SubscribersService } from '../services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrls: ['./subscribers.component.css']
})
export class SubscribersComponent implements OnInit{
    subscribersArray:Array<object>|any;
    constructor(private subService:SubscribersService) { }
  
    ngOnInit(): void {
      this.subService.loadData().subscribe(data => {
        this.subscribersArray = data;
      })
    }
    deleteSubscriber(id:string){
      this.subService.deleteData(id);
    }
}

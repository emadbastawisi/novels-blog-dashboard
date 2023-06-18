import { Component, OnInit } from '@angular/core';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-all-post',
  templateUrl: './all-post.component.html',
  styleUrls: ['./all-post.component.css']
})
export class AllPostComponent implements OnInit {

  postArray:Array<object> | any[]=[];
  constructor(private postService:PostsService) { }
  ngOnInit(): void {
    this.postService.loadData().subscribe(data=>{
      this.postArray=data;
    })
  }

  onDelete(postImgPath:string ,id:string){
    if(confirm("Are you sure you want to delete this post?")){
      this.postService.deleteImage(postImgPath,id);
    }
  } 
  onFeatured(id:string , value:boolean){
      this.postService.updateFeatured(id,value);
  }
}

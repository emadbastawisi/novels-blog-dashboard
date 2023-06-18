import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/post';
import { CategoriesService } from 'src/app/services/categories.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {

  permalink: string = '';
  imgSrc: any = "./assets/placeholder-image.jpg";
  selectedImage: any = null;
  categories: Array<object> | any = [];
  postForm: FormGroup;
  post: Post | any;
  formStatus : string = 'Add New';
  docId: string = '';
  constructor(
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private postService: PostsService,
    private route: ActivatedRoute,
  ) {
    this.route.queryParams.subscribe(params => {
      this.docId = params['id'];
      this.postService.loadPost(params['id']).subscribe(data => {
        this.post = data;
        if (this.post) {
          this.postForm.patchValue({
            title: this.post.title,
            permalink: this.post.permalink,
            excerpt: this.post.excerpt,
            category: [`${this.post.category.categoryId}-${this.post.category.category}`],
            postImgPath: this.post.postImgPath,
            content: this.post.content,
          });
          this.imgSrc = this.post.postImgPath
          this.selectedImage = this.post.postImgPath
          this.formStatus = 'Edit'
        };
      }
      );
    });

    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(10)]],
      permalink: [{ value: '', disabled: true }, Validators.required],
      excerpt: ['', [Validators.required, Validators.minLength(50)]],
      category: ['', Validators.required],
      postImg: ['', Validators.required],
      content: ['', Validators.required]
    });
  }


  ngOnInit(): void {
    this.categoryService.loadData().subscribe(data => {
      this.categories = data;
    });
  }
  get fc() {
    return this.postForm.controls;
  }
  onTitleChanged($event: Event) {
    const title = ($event.target as HTMLInputElement).value;
    this.postForm.patchValue({
      permalink: title.replace(/\s/g, '-')
    });
  }
  showPreview($event: Event) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imgSrc = e.target?.result;
    }
    reader.readAsDataURL(($event.target as HTMLInputElement).files![0]);
    this.selectedImage = ($event.target as HTMLInputElement).files![0];
  }
  onSubmit() {
    let splittedCategory =  this.postForm.getRawValue().category.toString().split('-');

    const postData: Post = {
      title: this.postForm.getRawValue().title,
      permalink: this.postForm.getRawValue().permalink,
      category: {
        categoryId: splittedCategory[0],
        category: splittedCategory[1]
      },
      postImgPath: '',
      excerpt: this.postForm.getRawValue().excerpt,
      content: this.postForm.getRawValue().content,
      isFeatured: false,
      views: 0,
      status: 'new',
      createdAt: new Date(),
    }
    this.postService.uploadImage(this.selectedImage, postData , this.formStatus, this.docId);
    this.postForm.reset();
    this.imgSrc = "./assets/placeholder-image.jpg";
    this.selectedImage = null;

  }
}

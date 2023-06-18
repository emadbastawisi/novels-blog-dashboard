import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(
    private storage: AngularFireStorage ,
    private afs:AngularFirestore ,
    private toastr: ToastrService,
    private router: Router) { }

  uploadImage(image: any, postData: any , formStatus: string, id: string ) {
    const filePath = `postIMG/${Date.now()}`;

    this.storage.upload(filePath, image).then(() => {

      this.storage.ref(filePath).getDownloadURL().subscribe(url => {
        postData.postImgPath = url;
        if (formStatus == 'Edit') {
          this.updatePost(id, postData);
          return;
        }
        else{
          this.savePost(postData);  
        }

      }
      );
    }
    );
  }
  savePost(postData: any) {
    this.afs.collection('posts').add(postData).then(() => {
      this.toastr.success("Post added sucessfuly");
      this.router.navigate(['/posts']);
    });
  }
  loadData() {
    return this.afs.collection('posts').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      })
    );
  }
  loadPost(id: string) { 
    return this.afs.doc(`posts/${id}`).valueChanges();
  }
  updatePost(id: string, postData: any) {
    this.afs.doc(`posts/${id}`).update(postData).then(() => {
      this.toastr.success("Post updated sucessfuly");
      this.router.navigate(['/posts']);
    });
  }

  deleteImage(postImgPath: string, id: string){
    this.storage.storage.refFromURL(postImgPath).delete().then(()=>{
      this.deletePost(id);
    });
  }

  deletePost(id: string){
    this.afs.doc(`posts/${id}`).delete().then(()=>{
      this.toastr.success("Post deleted sucessfuly");;
    });
  }
  updateFeatured(id: string, value: boolean){
    this.afs.doc(`posts/${id}`).update({isFeatured: value}).then(()=>{
      this.toastr.info("Featured status updated");
    });
  }
}

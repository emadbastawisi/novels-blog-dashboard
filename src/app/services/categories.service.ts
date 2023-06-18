import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/internal/operators/map';
import { Category } from '../models/category';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private afs: AngularFirestore, private toastr: ToastrService) { }
  saveData(data: any) {
    this.afs.collection('categories').add(data)
      .then(docRef => { this.toastr.success('Category added successfully', 'Success'); })
      .catch(error => { console.log(error) });
  }

  loadData() {
    return this.afs.collection('categories').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      })
    );
  }

  updateData(id: string, data: any) {
    this.afs.doc(`categories/${id}`).update(data)
      .then(docRef => { this.toastr.success('Category updated successfully', 'Success'); })
      .catch(error => { console.log(error) });
  }

  deleteData(id: string) {
    this.afs.doc(`categories/${id}`).delete()
      .then(docRef => { this.toastr.success('Category deleted successfully', 'Success'); })
      .catch(error => { console.log(error) });
  }
}





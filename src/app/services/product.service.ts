import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { AngularFirestore,AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Observable <Product [] >;

  private productCollection: AngularFirestoreCollection<Product>;

  constructor(private firestore:AngularFirestore) {
   // this.products.push({
     /* name: "Aguacate",
      price: 100,
      description: "Lorem ipsum dolor sit amet.",
      type: "Frutas y Verduras",
      photo: "https://picsum.photos/500/300?random",
      */
   // });
    //this.products.push({
     /*  name: "Coca Cola",
      price: 20,
      description: "Lorem ipsum dolor sit amet.",
      type: "Abarrotes",
      photo: "https://picsum.photos/500/300?random" */
    //});
    //this.products.push({
/*       name: "Jabón Zote",
      price: 40,
      description: "Lorem ipsum dolor sit amet.",
      type: "Limpieza",
      photo: "https://picsum.photos/500/300?random" */
    //});
    //this.products.push({
    //  name: "Aspirina",
      //price: 50,
//description: "Lorem ipsum dolor sit amet.",
    //  type: "Farmacia",
    //  photo: "https://picsum.photos/500/300?random"
    //});
    this.productCollection = 
    firestore.collection<Product>('products');
    this.products = 
    this.productCollection.valueChanges();
  }

  saveProduct(product: Product): Promise<String> {
   // this.products.push(product);
   // return of(product);
   return this.productCollection.add(product)
   .then((doc)=>{
    console.log("Product added with id:" +doc.id);
    return "success";
   })
   .catch((error)=>{
    console.log("Error adding product: "+error);
    return "error";
   });

  }

  getProducts(): Observable<Product[]> {
    return this.products;
  }
}

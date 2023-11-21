import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Cart, Product, CartItem } from '../models/product.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartCollection: AngularFirestoreCollection<Cart>;
  private cartDoc: Observable<Cart>;

  constructor(private firestore: AngularFirestore) {
    this.cartCollection = firestore.collection<Cart>('cart');
    this.cartDoc = this.cartCollection.doc('user-cart').snapshotChanges().pipe(
      map((changes) => {
        const data = changes.payload.data() as Cart;
        return {
          ...data,
          items: data.items.map((item: any) => {
            return {
              product: item.product,
              quantity: item.quantity
            } as CartItem;
          })
        } as Cart;
      })
    );
  }

  public getCart(): Observable<Cart> {
    return this.cartDoc;
  }

  public addToCart(product: Product): void {
    this.cartCollection.doc('user-cart').get().subscribe((cartSnapshot) => {
      const cart = cartSnapshot.data() as Cart || { items: [], total: 0, itemCount: 0 };

      const existingCartItem = cart.items.find((item) => item.product.name === product.name);

      if (existingCartItem) {
        // El producto ya existe en el carrito, actualiza la cantidad
        existingCartItem.quantity += 1;
      } else {
        // El producto no existe en el carrito, agrégalo como un nuevo elemento
        const newItem: CartItem = {
          product: product,
          quantity: 1,
        };
        cart.items.push(newItem);
      }

      // Actualiza el total y la cantidad de artículos
      cart.total = this.calculateTotal(cart);
      cart.itemCount = this.calculateItemCount(cart);

      // Guarda el carrito actualizado en Firestore
      this.cartCollection.doc('user-cart').set(cart);
    });
  }

  public removeItemFromCart(item: CartItem): void {
    this.cartCollection.doc('user-cart').get().subscribe((cartSnapshot) => {
      const cart = cartSnapshot.data() as Cart || { items: [], total: 0, itemCount: 0 };

      const index = cart.items.findIndex((cartItem) => cartItem === item);
      if (index !== -1) {
        cart.items.splice(index, 1);

        // Actualiza el total y la cantidad de artículos
        cart.total = this.calculateTotal(cart);
        cart.itemCount = this.calculateItemCount(cart);

        // Guarda el carrito actualizado en Firestore
        this.cartCollection.doc('user-cart').set(cart);
      }
    });
  }

  private calculateTotal(cart: Cart): number {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  private calculateItemCount(cart: Cart): number {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  }
}

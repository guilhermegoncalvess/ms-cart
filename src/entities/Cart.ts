import { ObjectId } from 'mongodb';
import Produtc from './Product';

export interface Cart {
  _id?: ObjectId;
  userId: string;

  products: Produtc[];
  totalPrice: number;
}

export interface CartPayload {
  userId: string;
  product: Produtc;
}

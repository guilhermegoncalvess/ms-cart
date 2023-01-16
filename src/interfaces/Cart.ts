import { Cart, CartPayload } from '../entities/Cart';

export interface CartInterface {
  insert(payload: CartPayload): Promise<Cart>;
  findAll(): Promise<Cart[]>;
  findByUserId(id: string): Promise<Cart | null>;
}

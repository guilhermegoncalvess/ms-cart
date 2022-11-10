import { Cart } from '../entities/Cart';
import CartRepository from '../repositories/CartRepository';

export default class CartController {
  async insert(payload: any): Promise<Cart> {
    const cartRepository = new CartRepository();

    return cartRepository.insert(payload.body);
  }

  async findAll(): Promise<Cart[]> {
    const cartRepository = new CartRepository();

    return cartRepository.findAll();
  }

  async findById(payload: any): Promise<Cart> {
    const { id } = payload.params;
    const cartRepository = new CartRepository();

    return cartRepository.findById(id);
  }

  async remove(payload: any): Promise<Cart> {
    const { id, userId } = payload.params;
    const cartRepository = new CartRepository();

    return cartRepository.remove({ id, userId });
  }
}

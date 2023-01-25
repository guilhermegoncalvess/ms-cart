import { Cart } from '../entities/Cart';
import AppError from '../errors/AppError';
import CartRepository from '../repositories/CartRepository';
import rpc from '../http/grpc/grpcClient';
import Produtc from '../entities/Product';

export default class CartService {
  async insert(payload: any): Promise<any> {
    const cartRepository = new CartRepository();

    return cartRepository.insert(payload);
  }

  async findAll(): Promise<Cart[]> {
    const cartRepository = new CartRepository();

    return cartRepository.findAll();
  }

  async findByUserId(id: any): Promise<Cart | null> {
    const cartRepository = new CartRepository();

    return cartRepository.findByUserId(id);
  }

  async remove(payload: any): Promise<Cart> {
    const cartRepository = new CartRepository();

    return cartRepository.remove(payload);
  }
}

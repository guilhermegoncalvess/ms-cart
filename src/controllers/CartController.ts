import { Cart } from '../entities/Cart';
import CartRepository from '../repositories/CartRepository';
import CartService from '../services/CartService';

import AppError from '../errors/AppError';

import rpc from '../http/grpc/grpcClient';
import Produtc from '../entities/Product';

export default class CartController {
  async insert(payload: any): Promise<any> {
    const { product, userId } = payload;

    const cartService = new CartService();

    const user = await new Promise((resolve: any, reject: any) => {
      rpc.user.GetUser({ id: userId }, (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });

    if (!user) {
      throw new AppError('Could not find the user', 404);
    }

    const productsReponse: Produtc = await new Promise(
      (resolve: any, reject: any) => {
        rpc.product.GetProduct({ id: product.id }, (err: any, res: any) => {
          if (err) return reject(err);
          return resolve(res);
        });
      },
    );

    console.log('produto', productsReponse)
    if (!productsReponse) {
      throw new AppError('Could not find product', 404);
    }

    return cartService.insert({ userId, product: { ...productsReponse, quantity: product.quantity } });
  }

  async findAll(): Promise<Cart[]> {
    const cartService = new CartService();

    return cartService.findAll();
  }

  async findByUserId(payload: any): Promise<Cart | null> {
    const { id } = payload
    const cartService = new CartService();

    const cart = await cartService.findByUserId(id);

    const cartRepository = new CartRepository();
    await cartRepository.clear(id)

    return cart
  }

  async remove(payload: any): Promise<Cart> {
    const cartService = new CartService();

    return cartService.remove(payload);
  }
}

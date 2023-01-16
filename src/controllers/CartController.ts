import { Cart } from '../entities/Cart';
import AppError from '../errors/AppError';
import CartRepository from '../repositories/CartRepository';
import rpc from '../http/grpc/grpcClient';
import Produtc from '../entities/Product';

export default class CartController {
  async insert(payload: any): Promise<any> {
    const { product, userId } = payload;
    const cartRepository = new CartRepository();

    const user = await new Promise((resolve: any, reject: any) => {
      rpc.user.GetUser({ id: userId }, (err: any, res: any) => {
        if (err) return reject(err);
        return resolve(res);
      });
    });

    if (!user) {
      throw new AppError('Could not find the user', 404);
    }

    const productResponse: Produtc = await new Promise(
      (resolve: any, reject: any) => {
        rpc.product.GetProduct({ id: product.id }, (err: any, res: any) => {
          if (err) return reject(err);
          return resolve(res);
        });
      },
    );

    if (!productResponse) {
      throw new AppError('Could not find product', 404);
    }

    const newProduct = {
      product: { ...productResponse, quantity: product.quantity },
      userId,
    };

    return cartRepository.insert(newProduct);
  }

  async findAll(): Promise<Cart[]> {
    const cartRepository = new CartRepository();

    return cartRepository.findAll();
  }

  async findByUserId(payload: any): Promise<Cart | null> {
    const { id } = payload.params;
    const cartRepository = new CartRepository();

    return cartRepository.findByUserId(id);
  }

  async remove(payload: any): Promise<Cart> {
    const { id, userId } = payload.params;
    const cartRepository = new CartRepository();

    return cartRepository.remove({ id, userId });
  }
}

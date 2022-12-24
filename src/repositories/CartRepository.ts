import { Collection } from 'mongodb';
import { CartInterface } from '../interfaces/Cart';
import { databaseClient } from '../database/index';
import AppError from '../errors/AppError';
import { CartPayload, Cart } from '../entities/Cart';

class CartRepository implements CartInterface {
  private readonly collection: Collection<Cart>;

  constructor() {
    this.collection = databaseClient.db('cart').collection('cart');
  }

  public async insert(payload: CartPayload): Promise<Cart | any> {
    const { userId, product } = payload;

    const cart = await this.collection.findOne<Cart>({
      userId,
    });

    if (cart) {
      const productIndex = cart.products.findIndex(
        item => item.id === product.id,
      );

      if (productIndex >= 0)
        if (product.quantity === 0)
          cart.products = cart.products.filter(item => item.id !== product.id);
        else cart.products[productIndex] = product;
      else cart.products = [...cart.products, product];

      cart.totalPrice = cart.products.reduce((acc, { value, quantity }) => {
        return acc + value * quantity;
      }, 0);

      await this.collection.updateOne(
        { userId },
        {
          $set: {
            products: cart.products,
            totalPrice: cart.totalPrice,
          },
        },
      );
      return cart;
    }

    if (!product.quantity) {
      return new AppError('The quantity value must be greater then 0');
    }

    const newCart = {
      userId,
      products: [product],
      totalPrice: product.value * product.quantity,
    };
    await this.collection.insertOne(newCart);
    return newCart;
  }

  public async findAll(): Promise<Cart[] | any> {
    return this.collection.find<Cart>({}).toArray();
  }

  public async findById(id: string): Promise<Cart> {
    try {
      const cart = await this.collection.findOne<Cart>({
        userId: id,
      });

      if (!cart) throw new AppError('could not find the cart.', 404);

      return cart;
    } catch (err: any) {
      return err;
    }
  }

  public async remove(payload: any): Promise<any> {
    const { userId, id } = payload;

    const cart = await this.collection.findOne<Cart>({
      userId,
    });

    if (!cart) {
      throw new AppError('could not find cart to user');
    }
    cart.products = cart.products.filter(item => item.id !== id);

    cart.totalPrice = cart.products.reduce((acc, { value, quantity }) => {
      return acc + value * quantity;
    }, 0);

    await this.collection.updateOne(
      { userId },
      {
        $set: {
          products: cart.products,
          totalPrice: cart.totalPrice,
        },
      },
    );

    return cart;
  }
}
export default CartRepository;

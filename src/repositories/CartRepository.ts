import { Collection, ObjectId } from 'mongodb';
import { CartInterface } from '../interfaces/Cart';
import { databaseClient } from '../database/index';
import AppError from '../errors/AppError';
import { CartPayload, Cart } from '../entities/Cart';

class CartRepository implements CartInterface {
  private readonly collection: Collection<Cart>;

  constructor() {
    this.collection = databaseClient.db('cart').collection('cart');
  }

  public async insert(payload: CartPayload): Promise<any> {
    const { userId, product } = payload;

    const cart = await this.findByUserId(userId);

    if (cart) {
      const productIndex = cart.products.findIndex(
        item => item._id === product._id,
      );

      const newCart = cart;
      if (productIndex >= 0) {
        if (product.quantity <= 0) {
          newCart.products = newCart.products.filter(item => item._id !== product._id);
        }
        else {
          newCart.products[productIndex] = product;
        }
      }
      else {
        if (product.quantity > 0) {
          newCart.products = [...newCart.products, product];
        }
      }

      newCart.totalPrice = newCart.products.reduce(
        (acc, { value, quantity }) => {
          return acc + value * quantity;
        },
        0,
      );

      await this.collection.updateOne(
        { userId },
        {
          $set: {
            products: newCart.products,
            totalPrice: newCart.totalPrice,
          },
        },
      );

      return newCart;
    }

    if (!product.quantity) {
      throw new AppError('The quantity value must be greater then 0');
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

  public async findByUserId(id: string): Promise<Cart | null> {
    const cart = await this.collection.findOne<Cart>({
      userId: id,
    });

    return cart;
  }

  public async remove(payload: any): Promise<any> {
    const { userId, id } = payload;

    const cart = await this.collection.findOne<Cart>({
      userId,
    });

    if (!cart) {
      throw new AppError('could not find cart to user');
    }
    cart.products = cart.products.filter(item => item._id !== id);

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

  public async clear(id: any): Promise<any> {
    const cart = await this.collection.findOne<Cart>({
      'userId': id,
    });

    if (!cart) {
      throw new AppError('could not find cart to user');
    }

    await this.collection.updateOne(
      { 'userId': id },
      {
        $set: {
          products: [],
          totalPrice: 0,
        },
      },
    );

    return cart;
  }
}
export default CartRepository;

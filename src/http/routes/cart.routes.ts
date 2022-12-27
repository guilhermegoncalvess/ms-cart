import { Router } from 'express';

import CartController from '../../controllers/CartController';

const cartRouter = Router();

cartRouter.put('/product', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.insert(request);

  return response.json(cart);
});

cartRouter.delete('/user/:userId/product/:id', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.remove(request);

  return response.json(cart);
});

cartRouter.get('/', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.findAll();

  return response.json(cart);
});

cartRouter.get('/user/:id', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.findById(request);

  return response.json(cart);
});

cartRouter.post('/order/send', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.sendOrder(request);

  return response.json(cart);
});

export default cartRouter;

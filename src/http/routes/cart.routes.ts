import { Router } from 'express';

import CartController from '../../controllers/CartController';

const cartRouter = Router();

cartRouter.put('/product', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.insert({ ...request.body });
  return response.json(cart);
});

//http://localhost:3335/cart/user/a83bd635-f9d0-4a7b-8bce-dd7e3a88532e/product/63c55cd34997e38ad05a945e
cartRouter.delete('/user/:userId/product/:id', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.remove({ ...request.params, ...request.body, ...request.query });

  return response.json(cart);
});

cartRouter.get('/', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.findAll();

  return response.json(cart);
});

cartRouter.get('/user/:id', async (request, response) => {
  const cartController = new CartController();

  const cart = await cartController.findByUserId({ ...request.params, ...request.body, ...request.query });

  return response.json(cart);
});

export default cartRouter;

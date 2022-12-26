import { Router } from 'express';

import cartRouter from './cart.routes';

const routes = Router();

routes.use('/cart', cartRouter);
routes.use('/', async (request, response) => {
  return response.json({});
});
export default routes;

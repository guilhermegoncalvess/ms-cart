import { Router } from 'express';

import productsRouter from './cart.routes';

const routes = Router();

routes.use('/', productsRouter);

export default routes;

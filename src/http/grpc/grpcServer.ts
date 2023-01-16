import grpc from 'grpc';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import CartController from '../../controllers/CartController';

// import UserController from '../../controllers/UserController';

const packageDefinition = protoLoader.loadSync(
  path.resolve(`${__dirname}/schema.proto`),
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
);

const cart_proto: any =
  grpc.loadPackageDefinition(packageDefinition).CartService;

const GetCart = async (call: any, callback: any) => {
  try {
    const controller = new CartController();
    callback(null, await controller.findByUserId(call.request));
  } catch (err: any) {
    console.log(err);
    callback({
      code: grpc.status.INTERNAL,
      message: err.message,
    });
  }
};

/* eslint-disable*/

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
const grpcServer = (): any => {
  const server = new grpc.Server();

  server.addService(cart_proto.service, { GetCart });

  server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
    },
  );
  console.log('0.0.0.0:50051');
};

export default grpcServer;

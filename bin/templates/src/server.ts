import express from 'express';
import { PORT } from './config/index.config';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import { IRoutes } from './interfaces/routes.interface';

class Server {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: IRoutes[]){
    /** 
     * Instanticate the express app in this.app
     * Set application port configured in Environment/Configuration;
    */

    this.app = express();
    this.env = 'production';
    this.port = PORT;

    /** 
     * Execute steps required to setup the service.
     * @function initializeDatabase(): Connect to the ORM of choice mentioned.
     * ------- currently supports mongoose and sequelize
     * @function initializeMiddlewares(): Inject required middlewares.
     * @function initializeAPIEndpoints(): Inject Routes that are configured in Individual Routing Files
    */

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeAPIEndpoints(routes);
  }

  public listen = () => {
    this.app.listen(this.port, () => {
      /**
       * This is where the express server is initialised. 
       * Log Something to know the status of application here.
      */
      console.log(`Express Server started on PORT: ${this.port}`);
    })
  }
  
  private initializeDatabase = () => {
    // Connect to the Desired ORM here.
    /**
     * Example for Mongoose
     * @function: connect(DATABASE_CONNECTION_STRING, options)     
    */
    // connect(DATABASE_CONNECTION_STRING, options)
  }

  private initializeMiddlewares = () => {
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: true}));
    this.app.use(cookieParser());
    /** 
     * More middlewares for Error Handling, Request Processing, etc can be injected here.
    */
  }

  private initializeAPIEndpoints = (routes: IRoutes[]) => {
    routes.forEach(route => {
      this.app.use('/', route.router);
    })
  }

}

export default Server;
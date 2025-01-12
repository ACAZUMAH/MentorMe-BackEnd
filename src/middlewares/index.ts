// import passport from "passport";
// import session from "express-session";
// import connectMongo from 'connect-mongodb-session';
// import { Express } from "express";

// /**
//  * apply all meddlewre to the epress to the server
//  * @param app the express app
//  * @returns the app after applying all middlewares
//  */
// const applyMiddlewares = async(app: Express) => {
//     const mongoStore = connectMongo(session);

//     const store = new mongoStore({
//         uri: process.env.DATABASE_URL,
//         collection: 'sessions'
//     });

//     store.on('error', (err: any) => console.log(err));

//     app.use(
//         session({
//             secret: process.env.SESSION_SECRET as string,
//             resave: false,
//             saveUninitialized: false,
//             store: store
//         })
//     );

//     app.use(passport.initialize());

//     app.use(passport.session()); 

//     return app;

// };

// export default applyMiddlewares;
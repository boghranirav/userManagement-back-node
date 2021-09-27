require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
// const morgan = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const app = express();
const session = require("express-session");
const responseTime = require("response-time");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./app/graphql/schema");
const graphqlResolver = require("./app/graphql/resolvers");
// var cookieParser = require("cookie-parser");
// var csrf = require("csurf");
app.use(responseTime());

// Setup express server port from ENV, default: 3000
app.set("port", process.env.PORT || 5000);

// for parsing json
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);
// for parsing application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);
/**
 * use cors
 */
app.use(cors());

// var csrfProtection = csrf({ cookie: true });
// var parseForm = bodyParser.urlencoded({ extended: false });
// app.use(cookieParser());

/**
 * allow cors origin
 */
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,authorization"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError || 500;
      return { message, status: code, data };
    },
  })
);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(helmet());

app.use(`/product`, express.static("app/controller/Image/product"));
app.use(`/vehicle`, express.static("app/controller/Image/vehicle"));
app.use(`/college`, express.static("app/controller/Image/college"));

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
db.sequelize.sync();

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  return res.json({ message: error.message || "An unknown error occurred!" });
});

const route = require("./app/route");
app.use(route);

app.listen(app.get("port"), () => {
  console.log(
    `Server listening in ${process.env.env} mode to the port ${app.get(
      "port"
    )} ${new Date()}`
  );
});
app.timeout = 320000;

import Rollbar from "rollbar";

const  rollbar = new Rollbar({
  accessToken: "533d47cb05d8481e9e0b3edc416992bc",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbar;
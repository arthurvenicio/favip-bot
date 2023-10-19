import env from "../env.js";

export class HealthController {
  constructor() {}

  async handle(req, res) {
    return res.send({
      status: "OK",
      version: env.APP_VERSION,
    });
  }
}

module.exports = class ExpressRouterAdapter {
  static adapt (router, method = 'route') {
    return async (req, res) => {
      const httpRequest = {
        body: req.body,
        params: req.params
      }
      const httpResponse = await router[method](httpRequest)
      if (httpResponse.body !== null && httpResponse.body !== undefined) {
        res.status(httpResponse.statusCode).json(httpResponse.body)
      } else {
        res.status(httpResponse.statusCode).send()
      }
    }
  }
}

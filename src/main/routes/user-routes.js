const { adapt } = require('../adapters/express-router-adapter')
const UserRouterComposer = require('../composers/user-router-composer')

module.exports = router => {
  const userRouter = UserRouterComposer.compose()
  router.post('/users', adapt(userRouter, 'create'))
  router.get('/users', adapt(userRouter, 'loadAll'))
  router.get('/users/:id', adapt(userRouter, 'loadById'))
  router.put('/users/:id', adapt(userRouter, 'update'))
  router.delete('/users/:id', adapt(userRouter, 'delete'))
}

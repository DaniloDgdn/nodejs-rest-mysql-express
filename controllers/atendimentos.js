module.exports = app => {
  app.get('/atendimentos', (req, res) => res.send('acessou a tela de atendimentos.'))

  app.post('/atendimentos', (req, res) => {
    console.log(req.body)
    res.send('enviou um dado para atendimentos.')
  })
}
const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        const atendimentoDatado = { ...atendimento, dataCriacao, data }

        const dataEValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteEValido = atendimento.cliente.length >= 5

        const validacoes = [
            {
                nome: 'data',
                valido: dataEValida,
                descricao: 'o campo data deve ter valor maior ou igual a data atual'
            },
            {
                nome: 'nome do cliente',
                valido: clienteEValido,
                descricao: 'o campo nome deve ter pelo menos 5 caracteres'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if (existemErros) {
            res.status(400).json(erros)
        }
        else {
            const sql = 'INSERT INTO Atendimentos SET ?'

            conexao.query(sql, atendimentoDatado, (erro, resultado) => {
                if (erro) {
                    res.status(400).json(erro)
                } else {
                    res.status(201).json(resultado)
                }
            })
        }
    }

    lista(res) {
        const sql = 'SELECT * FROM Atendimentos'

        conexao.query(sql, (erro, resultados) => {
            if (erro) {
                res.status(400).json(erro)
            }
            else {
                res.status(200).json(resultados)
            }

        })
    }

    listaID(id, res) {
        const sql = `SELECT * FROM Atendimentos where id=${id}`

        conexao.query(sql, (erro, resultados) => {
            const resultado = resultados[0]
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(200).json(resultado)
            }
        })
    }

    altera(id, valores, res) {
        if (valores.data) {
            valores.data = moment(valores.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erros, resultados) => {
            if (erros) {
                res.status(400).json(erros)
            }
            else {
                res.status(200).json(resultados)
            }
        })
    }
}

module.exports = new Atendimento

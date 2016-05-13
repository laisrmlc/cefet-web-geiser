var fs = require('fs');  //import do fs - modulo do sistema pra acessar arquivos e diretórios
var _ = require('underscore');
var express = require('express'),
    app = express(); //modulo para criar servidor

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server started://%s:%s', host, port);
});

app.use(express.static('client'));
app.set('view engine', 'hbs');
app.set('views', 'server/views');

// carregar "banco de dados" (data/jogadores.json e data/jogosPorJogador.json)
// você pode colocar o conteúdo dos arquivos json no objeto "db" logo abaixo
// dica: 3-4 linhas de código (você deve usar o módulo de filesystem (fs))

var db = [];

fs.readFile('server/data/jogadores.json',
	function(err, data){
		db[0] = JSON.parse(data);
	}
);

fs.readFile('server/data/jogosPorJogador.json',
	function(err, data){
		db[1] = JSON.parse(data);
	}
);

app.get('/',
	function(request, response){
		response.render('index.hbs', db[0]);

	}
);

app.get('/jogador/:numero_identificador/',
  function(request, response){
    var pag={};
    var i,j;
    var id = request.params.numero_identificador;

    for(i=0 ; i<db[0].players.length ; i++){
      if (db[0].players[i].steamid == id){
        pag.player = db[0].players[i];
      }
    }
   pag.infogames = db[1][id];
   var cont=0;
   var played=[];
    for(j=0 ; j < pag.infogames.games.length ; j++ ){

        if(pag.infogames.games[j].playtime_forever ==0){
          cont++;
        }
        pag.infogames.games[j].playTimeHr = ((pag.infogames.games[j].playtime_forever)/60).toFixed(0);
    }

    var morePlayed = _.first(_.sortBy(pag.infogames.games, function(game){ //pega os 5 mais jogados
        return -game.playtime_forever;
      }
    ),5);
    var timetop=[];
    for(i=0 ; i < 5 ; i++){
      timetop[i] = (morePlayed[i].playtime_forever/60).toFixed(0);
    }

    pag.timeMostPlayed = timetop[0];
    pag.timeTop = timetop;
    pag.mostplayed = _.first(morePlayed);
    pag.moreplayed = morePlayed;
    pag.timePlayed = played;
    pag.notPlayed = cont;

    response.render('jogador.hbs', pag);
  }
);


// configurar qual templating engine usar. Sugestão: hbs (handlebars)
//app.set('view engine', '???');


// EXERCÍCIO 2
// definir rota para página inicial --> renderizar a view index, usando os
// dados do banco de dados "data/jogadores.json" com a lista de jogadores
// dica: o handler desta função é bem simples - basta passar para o template
//       os dados do arquivo data/jogadores.json

// EXERCÍCIO 3
// definir rota para página de detalhes de um jogador --> renderizar a view
// jogador, usando os dados do banco de dados "data/jogadores.json" e
// "data/jogosPorJogador.json", assim como alguns campos calculados
// dica: o handler desta função pode chegar a ter umas 15 linhas de código


// EXERCÍCIO 1
// configurar para servir os arquivos estáticos da pasta "client"
// dica: 1 linha de código

// abrir servidor na porta 3000
// dica: 1-3 linhas de código

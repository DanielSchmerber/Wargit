import mcServer from "flying-squid";

import superjson from 'superjson';

export function  startServer() {
  var server = mcServer.createMCServer({
    'motd': 'Wargit linking server',
    'port': 25565,
    'max-players': 10,
    'online-mode': true,
    'logging': true,
    'gameMode': 2,
    'difficulty': 1,
    'worldFolder': 'world',
    'generation': {
      'name': 'diamond_square',
      'options': {
        'worldHeight': 80
      }
    },
    'kickTimeout': 10000,
    'plugins': {},
    'modpe': false,
    'view-distance': 10,
    'player-list-text': {
      'header': 'Flying squid',
      'footer': 'Test server'
    },
    'everybody-op': false,
    'max-entities': 100,
    'version': '1.21'
  })

  server.commands.add({
    base: 'hello',
    info: 'Print hello in the console',
    usage: 'hello <pseudo>',
    parse(str)  {
      const args = str.split(' ');
      if(args.length != 1) return false;

      return {pseudo:args[0]};
    },
    action({pseudo}, ctx) {
      console.log("OwO")
      console.log(superjson.stringify(ctx))
      console.log(superjson.stringify(pseudo))
    }
  });



}
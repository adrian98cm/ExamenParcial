import { fetchData } from './fetchdata';
import { GraphQLServer } from 'graphql-yoga';
import { stripIgnoredCharacters } from 'graphql';

const url = 'https://swapi.co/api/people/';

const runApp = data => {


  const typeDefs = `
  type Query{
    test: String!
    people(page: Int, number: Int, name: String, gender: String):[Person!]!
    character(id: Int!): Person!
  
  }

  type Person{
    name: String!
    gender: String!
    url: String!

  }
 
  `
  const resolvers = {
    Query: {
      test() {
        return ("artista");
      },


      people: (parent, args, ctx, info) => {
        const page = args.page || 1;
        const number = args.number || 10;

        const inicio = (page - 1) * number;
        const fin = inicio + number;

        const datos = data
          .filter(elem => elem.gender.includes(args.gender || elem.gender))
          .filter(elem => elem.name.includes(args.name || elem.name))
          .slice(inicio, fin)
          .map(obj => {
            return {
              name: obj.name,
              gender: obj.gender,
              url: obj.url
            }
          })
        return datos;
      },

      character: (parent, args, ctx, info) => {
        const number = args.id;
        const urlbase = "https://swapi.co/api/people/"
        const urlDef = `${urlbase}${number}/`;

        const obj = data.find(c => c.url === urlDef)
        return {
          name: obj.name,
          gender: obj.gender,
          url: obj.url
        }

      }

    }
  }

  const server = new GraphQLServer({ typeDefs, resolvers });
  server.start({ port: "4000" });
};

fetchData(runApp, url);
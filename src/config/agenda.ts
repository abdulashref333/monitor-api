import Agenda, { AgendaConfig } from 'agenda';

let configureMongoDBObj:AgendaConfig = {
    db: {
      address: `mongodb://localhost:27017/${process.env.DB_NAME}`,
      collection: "jobs",
      options: {},
    },
  };

const agenda = new Agenda(configureMongoDBObj);
export default agenda;
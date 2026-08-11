const EventEmitter = require('events');
const agenda = require('../services/agenda');

const crmEvents = new EventEmitter();

crmEvents.on('DealMovedEvent', async (eventData) => {
    console.log(`\n📣 [DOMAIN EVENT EMITTED]: Deal "${eventData.title}" shifted to [${eventData.newStage}]`);
    await agenda.now('processDealMove', eventData);
    console.log(`📥 [QUEUE] Job successfully saved to MongoDB collection 'agendaJobs'.`);
});

module.exports = crmEvents;
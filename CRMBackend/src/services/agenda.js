const Agenda = require('agenda');

const agenda = new Agenda({ db: { address: process.env.MONGO_URI, collection: 'agendaJobs' } });

agenda.define('processDealMove', async (job) => {
    const data = job.attrs.data;
    console.log(`\n⚙️ [MONGO WORKER] Processing job for deal: ${data.title}...`);

    if (data.newStage === 'Proposal') {
        console.log(`📧 [ACTION FIRED] Sending 'Draft Proposal' email to contact.`);
    } else if (data.newStage === 'Won') {
        console.log(`🎉 [ACTION FIRED] Triggering 'Welcome Onboard' sequence for Tenant: ${data.tenantId}`);
    } else {
        console.log(`⏳ [ACTION SKIPPED] No automations configured for stage: ${data.newStage}`);
    }
});

module.exports = agenda;
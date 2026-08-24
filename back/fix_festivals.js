import mongoose from 'mongoose';
import Festival from './src/models/Festival.js';

const uri = 'mongodb+srv://rainishaagrawal30_db_user:L8I5GGoC3bxYEQ49@cluster0.msjxap1.mongodb.net/voyageai?retryWrites=true&w=majority&appName=Cluster0';

const festivals2026 = {
  "Gion Matsuri Festival": { start: "2026-07-01", end: "2026-07-31" },
  "Carnival of Venice": { start: "2026-02-03", end: "2026-02-17" },
  "Songkran Water Festival": { start: "2026-04-13", end: "2026-04-15" },
  "Oktoberfest": { start: "2026-09-19", end: "2026-10-04" },
  "Diwali Festival of Lights": { start: "2026-11-08", end: "2026-11-12" },
  "Rio Carnival": { start: "2026-02-13", end: "2026-02-18" },
  "Cherry Blossom Festival": { start: "2026-03-20", end: "2026-04-10" },
  "Edinburgh Fringe Festival": { start: "2026-08-07", end: "2026-08-31" },
  "Dia de los Muertos": { start: "2026-11-01", end: "2026-11-02" },
  "Chinese New Year": { start: "2026-02-17", end: "2026-03-03" },
  "Holi Festival of Colors": { start: "2026-03-03", end: "2026-03-04" },
  "La Tomatina": { start: "2026-08-26", end: "2026-08-26" },
  "Mardi Gras": { start: "2026-02-17", end: "2026-02-17" },
  "Glastonbury Festival": { start: "2026-06-24", end: "2026-06-28" },
  "Sapporo Snow Festival": { start: "2026-02-04", end: "2026-02-11" },
  "Cannes Film Festival": { start: "2026-05-12", end: "2026-05-23" },
  "Coachella Valley Music and Arts Festival": { start: "2026-04-10", end: "2026-04-19" }
};

const run = async () => {
  try {
    await mongoose.connect(uri);
    const dbFestivals = await Festival.find({});
    
    for (const fest of dbFestivals) {
      const dates = festivals2026[fest.name];
      if (dates) {
        fest.startDate = new Date(dates.start);
        fest.endDate = new Date(dates.end);
        await fest.save();
        console.log(\Updated \\);
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};
run();

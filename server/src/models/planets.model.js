const planets = require("./planets.mongo");

const { parse } = require("csv-parse");
const fs = require("fs");
const { join } = require("path");

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
      /**
       * We want to create a readable stream from the CSV file and pipe that stream into the CSV parser.
       * The CSV parser will then emit a data event for each line of the CSV file.
       * The pipe function connects a readable stream (the kepler file) source to a writable stream destination (the parse() function result).
       * readable.pipe(writable)
       */
      fs.createReadStream(join(__dirname, "..", "..", "data", "kepler_data.csv"))
        .pipe(
          parse({
            comment: "#",
            columns: true, // return each row as an object with the column names as keys
          })
        )
        .on("data", async (data) => {
          if (isHabitablePlanet(data)) {
            savePlanet(data);
          }
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .on("end", async () => {
          const countPlanetsFound = (await getAllPlanets()).length;
          console.log(
            `ONLY ${countPlanetsFound} habitable planets found!!`
          );
          console.log("CSV file successfully processed");
          resolve();
        });
    });
}

async function getAllPlanets() {
  return await planets.find({}, {
    '_id': 0, // exclude the _id field
    '__v': 0, // exclude the __v field, which is a versioning field that mongoose uses internally
  });
}

async function savePlanet(planet) {
  try{
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch(err) {
    console.error(`Could not save planet ${err}`)
  }
}

module.exports = {
  getAllPlanets,
  loadPlanetsData,
};

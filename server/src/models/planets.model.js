const planets = require("./planets.mongo");

const { parse } = require("csv-parse");
const fs = require("fs");
const { join } = require("path");

const habitablePlanets = [];
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
            await planets.create({
              keplerName: data.kepler_name,
            });
          }
        })
        .on("error", (err) => {
          console.log(err);
          reject(err);
        })
        .on("end", () => {
          console.log(
            `ONLY ${habitablePlanets.length} habitable planets found!!`
          );
          console.log("CSV file successfully processed");
          resolve();
        });
    });
}

function getAllPlanets() {
  return habitablePlanets;
}

module.exports = {
  getAllPlanets,
  loadPlanetsData,
};

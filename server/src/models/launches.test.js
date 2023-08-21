const { existsLaunchWithId, getAllLaunches, addNewLaunch, abortLaunchById, resetLaunches } = require("./launches.model");

let launches;

beforeEach(() => {
  resetLaunches();
  launches = getAllLaunches();
});

describe("Test getAllLaunches", () => {
  test("It should return all launches", () => {
    expect(launches).toHaveLength(1);
  }); 
});

describe("Test existsLaunchWithId", () => {
  test("It should return true for id 100", () => {
    expect(launches).toHaveLength(1);
    expect(existsLaunchWithId(100)).toBe(true);
  });
});

describe("Test addNewLaunch", () => {
  test("It should add a new launch", () => {
    expect(launches).toHaveLength(1);
    const launch = {
        mission: 'Kepler Exploration X',
        rocket: 'Explorer IS1',
        launchDate: new Date('December 27, 2030'),
        target: 'Kepler-442 b',
        customers: ['NASA', 'ZTM'],
        upcoming: true,
        success: true,
    };
    addNewLaunch(launch);
    const newLaunches = getAllLaunches();
    expect(newLaunches).toHaveLength(2);
    expect(existsLaunchWithId(101)).toBe(true);
  });
});

describe("Test abortLaunchById", () => {
  test("It should abort a launch by ID", () => {
    expect(launches).toHaveLength(1);
    const launch = {
      mission: "Kepler Exploration X",
      rocket: "Explorer IS1",
      launchDate: new Date("December 27, 2030"),
      target: "Kepler-442 b",
      customers: ["NASA", "ZTM"],
      upcoming: true,
      success: true,
    };
    addNewLaunch(launch);
    launches = getAllLaunches();
    expect(launches).toHaveLength(2);
    expect(existsLaunchWithId(100)).toBe(true);
    let aborted = abortLaunchById(100);
    expect(aborted.upcoming).toBe(false);
    expect(aborted.success).toBe(false);
  });
});

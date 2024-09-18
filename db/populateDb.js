require('dotenv').config();
const { Client } = require('pg');

const SQL = `
    CREATE TABLE IF NOT EXISTS themes (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(25)
    );

    CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    setName VARCHAR(40),
    pieceCount INTEGER,
    themeId INTEGER REFERENCES themes (id),
    qty INTEGER
    );

    CREATE TABLE IF NOT EXISTS minifigs (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(25),
    themeId INTEGER REFERENCES themes (id)
    );

    CREATE TABLE IF NOT EXISTS minifig_inclusions (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    setId INTEGER REFERENCES sets (id),
    minifigId INTEGER REFERENCES minifigs (id),
    minifigQty INTEGER
    );

    INSERT INTO themes (name) VALUES ('Star Wars'), ('Batman'), ('Harry Potter'), ('Minecraft');
`;

async function insertSet(queryObj, name, pieceCount, themeName, qty) {
    await queryObj.query(`INSERT INTO sets (setName, pieceCount, themeId, qty) 
                            SELECT $1, $2, id, $3 FROM themes 
                            WHERE name = $4;`, [name, pieceCount, qty, themeName]);
}

async function insertMinifig(queryObj, name, themeName) {
    await queryObj.query('INSERT INTO minifigs (name, themeId) SELECT $1, id FROM themes WHERE name = $2;', [name, themeName]);
}

async function insertMinifigSetInclusion(queryObj, setName, minifigName, qty) {
    await queryObj.query(`INSERT INTO minifig_inclusions (setId, minifigId, minifigQty) 
                            SELECT sets.id, minifigs.id, $1 FROM sets 
                            INNER JOIN minifigs ON sets.themeId = minifigs.themeId 
                            WHERE sets.setName = $2 AND minifigs.name = $3;`, [qty, setName, minifigName]);
}

async function main() {
    console.log('seeding');
    let connectionString;
    if(process.env.NODE_ENV === 'prod')
        connectionString = process.env.DATABASE_URL;
    else
        connectionString = process.env.CONNECTION_STRING;

    const client = new Client({connectionString: connectionString});

    try{
        await client.connect();
        await client.query(SQL);

        await insertSet(client, 'X-Wing Starfighter', 1953, 'Star Wars', 45);
        await insertSet(client, 'AT-AT', 1267,'Star Wars', 36 );
        await insertSet(client, 'TIE Bomber', 625, 'Star Wars', 72);
        await insertSet(client, 'AT-TE', 1082, 'Star Wars', 56);
        await insertSet(client, 'Homing Spider Droid', 295, 'Star Wars', 78);
        await insertSet(client, 'Obi-Wan Jedi Starfighter', 282, 'Star Wars', 37);

        await insertMinifig(client, 'Anakin Skywalker', 'Star Wars');
        await insertMinifig(client, 'Obi-Wan Kenobi', 'Star Wars');
        await insertMinifig(client, 'Commander Cody', 'Star Wars');
        await insertMinifig(client, 'Phase 2 Clone Trooper', 'Star Wars');
        await insertMinifig(client, 'Phase 1 Clone Trooper', 'Star Wars');
        await insertMinifig(client, 'Battle Droid', 'Star Wars');
        await insertMinifig(client, 'Super Battle Droid', 'Star Wars');
        await insertMinifig(client, 'Luke Skywalker', 'Star Wars');
        await insertMinifig(client, 'R2-D2', 'Star Wars');
        await insertMinifig(client, 'TIE Pilot', 'Star Wars');
        await insertMinifig(client, 'Stormtrooper', 'Star Wars');
        await insertMinifig(client, 'Snowtrooper', 'Star Wars');
        await insertMinifig(client, 'AT-AT Pilot', 'Star Wars');
        await insertMinifig(client, 'Hoth Rebel Trooper', 'Star Wars');
        await insertMinifig(client, 'Hoth Rebel Commander', 'Star Wars');

        await insertMinifigSetInclusion(client, 'X-Wing Starfighter', 'Luke Skywalker', 1);
        await insertMinifigSetInclusion(client, 'X-Wing Starfighter', 'R2-D2', 1);
        await insertMinifigSetInclusion(client, 'AT-AT', 'AT-AT Pilot', 2);
        await insertMinifigSetInclusion(client, 'AT-AT', 'Snowtrooper', 2);
        await insertMinifigSetInclusion(client, 'AT-AT', 'Hoth Rebel Trooper', 1);
        await insertMinifigSetInclusion(client, 'AT-AT', 'Hoth Rebel Commander', 1);
        await insertMinifigSetInclusion(client, 'TIE Bomber', 'TIE Pilot', 1);
        await insertMinifigSetInclusion(client, 'TIE Bomber', 'Stormtrooper', 1);
        await insertMinifigSetInclusion(client, 'AT-TE', 'Commander Cody', 1);
        await insertMinifigSetInclusion(client, 'AT-TE', 'Phase 2 Clone Trooper', 2);
        await insertMinifigSetInclusion(client, 'AT-TE', 'Battle Droid', 2);
        await insertMinifigSetInclusion(client, 'Homing Spider Droid', 'Anakin Skywalker', 1);
        await insertMinifigSetInclusion(client, 'Homing Spider Droid', 'Battle Droid', 3);
        await insertMinifigSetInclusion(client, 'Homing Spider Droid', 'Super Battle Droid', 2);
        await insertMinifigSetInclusion(client, 'Obi-Wan Jedi Starfighter', 'Obi-Wan Kenobi', 1);
        await insertMinifigSetInclusion(client, 'Obi-Wan Jedi Starfighter', 'Phase 1 Clone Trooper', 1);


        await insertSet(client, 'Batwing: Batman vs. The Joker', 357,'Batman', 49);
        await insertSet(client, 'Batmobile Tumbler', 422,'Batman', 35);
        await insertSet(client, 'Batcave - Shadow Box', 3981,'Batman', 46);
        await insertSet(client, 'Catwoman Cycle Chase', 139,'Batman', 25);
        await insertSet(client, 'Bane Toxic Truck Attack', 366,'Batman', 47);
        await insertSet(client, 'Harley Quinn Cannonball Attack', 425, 'Batman', 67);

        await insertMinifig(client, 'Batman', 'Batman');
        await insertMinifig(client, 'Bruce Wayne', 'Batman');
        await insertMinifig(client, 'Alfred Pennyworth', 'Batman');
        await insertMinifig(client, 'Robin', 'Batman');
        await insertMinifig(client, 'Batgirl', 'Batman');
        await insertMinifig(client, 'Catwoman', 'Batman');
        await insertMinifig(client, 'Bane', 'Batman');
        await insertMinifig(client, 'The Joker', 'Batman');
        await insertMinifig(client, 'Harley Quinn', 'Batman');
        await insertMinifig(client, 'Scarecrow', 'Batman');
        await insertMinifig(client, 'The Riddler', 'Batman');
        await insertMinifig(client, 'Killer Croc', 'Batman')
        await insertMinifig(client, 'Blue Beetle', 'Batman');
        await insertMinifig(client, 'Gotham PD Officer', 'Batman');

        await insertMinifigSetInclusion(client, 'Batwing: Batman vs. The Joker', 'Batman', 1);
        await insertMinifigSetInclusion(client, 'Batwing: Batman vs. The Joker', 'The Joker', 1);
        await insertMinifigSetInclusion(client, 'Batwing: Batman vs. The Joker', 'Gotham PD officer', 1);
        await insertMinifigSetInclusion(client, 'Batmobile Tumbler', 'Batman', 1);
        await insertMinifigSetInclusion(client, 'Batmobile Tumbler', 'Scarecrow', 1);
        await insertMinifigSetInclusion(client, 'Batcave - Shadow Box', 'Batman', 1);
        await insertMinifigSetInclusion(client, 'Batcave - Shadow Box', 'Bruce Wayne', 1);
        await insertMinifigSetInclusion(client, 'Batcave - Shadow Box', 'Alfred Pennyworth', 1);
        await insertMinifigSetInclusion(client, 'Batcave - Shadow Box', 'Blue Beetle', 1);
        await insertMinifigSetInclusion(client, 'Batcave - Shadow Box', 'Killer Croc', 1);
        await insertMinifigSetInclusion(client, 'Batcave - Shadow Box', 'The Riddler', 1);
        await insertMinifigSetInclusion(client, 'Catwoman Cycle Chase', 'Catwoman', 1);
        await insertMinifigSetInclusion(client, 'Catwoman Cycle Chase', 'Robin', 1);
        await insertMinifigSetInclusion(client, 'Catwoman Cycle Chase', 'Batgirl', 1);
        await insertMinifigSetInclusion(client, 'Bane Toxic Truck Attack', 'Bane', 1);
        await insertMinifigSetInclusion(client, 'Bane Toxic Truck Attack', 'Batgirl', 1);
        await insertMinifigSetInclusion(client, 'Bane Toxic Truck Attack', 'Gotham PD officer', 1);
        await insertMinifigSetInclusion(client, 'Harley Quinn Cannonball Attack', 'Harley Quinn', 1);
        await insertMinifigSetInclusion(client, 'Harley Quinn Cannonball Attack', 'Robin', 1);

        await insertSet(client, 'The Burrow', 2405, 'Harry Potter', 32);
        await insertSet(client, 'Tri-Wizard Tournament: The Arrival', 1229, 'Harry Potter', 39);
        await insertSet(client, 'Gringotts Wizarding Bank', 4801, 'Harry Potter', 24);
        await insertSet(client, 'Flying Ford Anglia', 165, 'Harry Potter', 56);
        await insertSet(client, 'Hogwarts Castle: Potions Class', 397, 'Harry Potter', 47);
        await insertSet(client, 'Forbidden Forest: Magical Creatures', 172, 'Harry Potter', 63);

        await insertMinifig(client, 'Harry Potter', 'Harry Potter');
        await insertMinifig(client, 'Ron Weasley', 'Harry Potter');
        await insertMinifig(client, 'Hermoine Granger', 'Harry Potter');
        await insertMinifig(client, 'Viktor Krum', 'Harry Potter');
        await insertMinifig(client, 'Fleur Delacour', 'Harry Potter');
        await insertMinifig(client, 'Cedric Diggory', 'Harry Potter');
        await insertMinifig(client, 'Arthur Weasley', 'Harry Potter');
        await insertMinifig(client, 'Molly Weasley', 'Harry Potter');
        await insertMinifig(client, 'Fred Weasley', 'Harry Potter');
        await insertMinifig(client, 'George Weasley', 'Harry Potter');
        await insertMinifig(client, 'Griphook', 'Harry Potter');
        await insertMinifig(client, 'Goblin Bank Teller', 'Harry Potter');
        await insertMinifig(client, 'Gringotts Guard', 'Harry Potter');
        await insertMinifig(client, 'Death Eater', 'Harry Potter');
        await insertMinifig(client, 'Bellatrix Lestrange', 'Harry Potter');
        await insertMinifig(client, 'Dragomir Despard', 'Harry Potter');
        await insertMinifig(client, 'Hagrid', 'Harry Potter');
        await insertMinifig(client, 'Buckbeak', 'Harry Potter');
        await insertMinifig(client, 'Professor Snape', 'Harry Potter');
        await insertMinifig(client, 'Seamus Finnigan', 'Harry Potter');

        await insertMinifigSetInclusion(client, 'The Burrow', 'Harry Potter', 1);
        await insertMinifigSetInclusion(client, 'The Burrow', 'Ron Weasley', 1);
        await insertMinifigSetInclusion(client, 'The Burrow', 'Arthur Weasley', 1);
        await insertMinifigSetInclusion(client, 'The Burrow', 'Molly Weasley', 1);
        await insertMinifigSetInclusion(client, 'The Burrow', 'Fred Weasley', 1);
        await insertMinifigSetInclusion(client, 'The Burrow', 'George Weasley', 1);
        await insertMinifigSetInclusion(client, 'Tri-Wizard Tournament: The Arrival', 'Harry Potter', 1);
        await insertMinifigSetInclusion(client, 'Tri-Wizard Tournament: The Arrival', 'Viktor Krum', 1);
        await insertMinifigSetInclusion(client, 'Tri-Wizard Tournament: The Arrival', 'Fleur Delacour', 1);
        await insertMinifigSetInclusion(client, 'Tri-Wizard Tournament: The Arrival', 'Cedric Diggory', 1);
        await insertMinifigSetInclusion(client, 'Gringotts Wizarding Bank', 'Harry Potter', 1);
        await insertMinifigSetInclusion(client, 'Gringotts Wizarding Bank', 'Griphook', 1);
        await insertMinifigSetInclusion(client, 'Gringotts Wizarding Bank', 'Goblin Bank Teller', 2);
        await insertMinifigSetInclusion(client, 'Gringotts Wizarding Bank', 'Gringotts Guard', 2);
        await insertMinifigSetInclusion(client, 'Gringotts Wizarding Bank', 'Death Eater', 1);
        await insertMinifigSetInclusion(client, 'Gringotts Wizarding Bank', 'Bellatrix Lestrange', 1);
        await insertMinifigSetInclusion(client, 'Gringotts Wizarding Bank', 'Dragomir Despard', 1);
        await insertMinifigSetInclusion(client, 'Hogwarts Castle: Potions Class', 'Professor Snape', 1);
        await insertMinifigSetInclusion(client, 'Hogwarts Castle: Potions Class', 'Ron Weasley', 1);
        await insertMinifigSetInclusion(client, 'Hogwarts Castle: Potions Class', 'Hermoine Granger', 1);
        await insertMinifigSetInclusion(client, 'Hogwarts Castle: Potions Class', 'Seamus Finnigan', 1);
        await insertMinifigSetInclusion(client, 'Forbidden Forest: Magical Creatures', 'Hagrid', 1);
        await insertMinifigSetInclusion(client, 'Forbidden Forest: Magical Creatures', 'Harry Potter', 1);
        await insertMinifigSetInclusion(client, 'Forbidden Forest: Magical Creatures', 'Hermoine Granger', 1);
        await insertMinifigSetInclusion(client, 'Forbidden Forest: Magical Creatures', 'Buckbeak', 1);

        await insertSet(client, 'The Ender Dragon and End Ship', 657,'Minecraft', 28);
        await insertSet(client, 'The Armory', 203,'Minecraft', 34);
        await insertSet(client, 'The Sword Outpost', 427,'Minecraft', 54);
        await insertSet(client, 'The Iron Golem Fortress', 868,'Minecraft', 68);
        await insertSet(client, 'The Deep Dark Battle', 584,'Minecraft', 62);
        await insertSet(client, 'The Skeleton Dungeon', 364,'Minecraft', 86);

        await insertMinifig(client, 'Ender Explorer', 'Minecraft');
        await insertMinifig(client, 'Ender Knight', 'Minecraft');
        await insertMinifig(client, 'Shulker', 'Minecraft');
        await insertMinifig(client, 'Enderman', 'Minecraft');
        await insertMinifig(client, 'Alex', 'Minecraft');
        await insertMinifig(client, 'Armorsmith', 'Minecraft');
        await insertMinifig(client, 'Sentinel Soldier', 'Minecraft');
        await insertMinifig(client, 'Guardian Warrior', 'Minecraft');
        await insertMinifig(client, 'Creeper', 'Minecraft');
        await insertMinifig(client, 'Skeleton', 'Minecraft');
        await insertMinifig(client, 'Pig', 'Minecraft');
        await insertMinifig(client, 'Allay', 'Minecraft');
        await insertMinifig(client, 'Crystal Knight', 'Minecraft');
        await insertMinifig(client, 'Golden Knight', 'Minecraft');
        await insertMinifig(client, 'Charged Creeper', 'Minecraft');
        await insertMinifig(client, 'Skeleton Horseman', 'Minecraft');
        await insertMinifig(client, 'Iron Golem', 'Minecraft');
        await insertMinifig(client, 'Arbalest Knight', 'Minecraft');
        await insertMinifig(client, 'Netherite Knight', 'Minecraft');
        await insertMinifig(client, 'Warden', 'Minecraft');
        await insertMinifig(client, 'Cave Explorer', 'Minecraft');

        await insertMinifigSetInclusion(client ,'The Ender Dragon and End Ship' ,'Ender Explorer', 1);
        await insertMinifigSetInclusion(client ,'The Ender Dragon and End Ship' ,'Ender Knight', 1);
        await insertMinifigSetInclusion(client ,'The Ender Dragon and End Ship' ,'Shulker', 1);
        await insertMinifigSetInclusion(client ,'The Ender Dragon and End Ship' ,'Enderman', 1);
        await insertMinifigSetInclusion(client ,'The Armory' ,'Alex', 1);
        await insertMinifigSetInclusion(client ,'The Armory' ,'Armorsmith', 1);
        await insertMinifigSetInclusion(client ,'The Sword Outpost' ,'Sentinel Soldier', 1);
        await insertMinifigSetInclusion(client ,'The Sword Outpost' ,'Guardian Warrior', 1);
        await insertMinifigSetInclusion(client ,'The Sword Outpost' ,'Creeper', 1);
        await insertMinifigSetInclusion(client ,'The Sword Outpost' ,'Skeleton', 1);
        await insertMinifigSetInclusion(client ,'The Sword Outpost' ,'Pig', 1);
        await insertMinifigSetInclusion(client ,'The Sword Outpost' ,'Allay', 1);
        await insertMinifigSetInclusion(client ,'The Iron Golem Fortress' ,'Crystal Knight', 1);
        await insertMinifigSetInclusion(client ,'The Iron Golem Fortress' ,'Golden Knight', 1);
        await insertMinifigSetInclusion(client ,'The Iron Golem Fortress' ,'Charged Creeper', 1);
        await insertMinifigSetInclusion(client ,'The Iron Golem Fortress' ,'Skeleton Horseman', 2);
        await insertMinifigSetInclusion(client ,'The Iron Golem Fortress' ,'Iron Golem', 1);
        await insertMinifigSetInclusion(client ,'The Deep Dark Battle' ,'Arbalest Knight', 1);
        await insertMinifigSetInclusion(client ,'The Deep Dark Battle' ,'Netherite Knight', 1);
        await insertMinifigSetInclusion(client ,'The Deep Dark Battle' ,'Warden', 1);
        await insertMinifigSetInclusion(client ,'The Skeleton Dungeon' ,'Cave Explorer', 1);
        await insertMinifigSetInclusion(client ,'The Skeleton Dungeon' ,'Skeleton', 3);
    }
    catch(e){
        console.error(e);
    }
    finally{
        await client.end();
        console.log('Done');
    }
}

main();
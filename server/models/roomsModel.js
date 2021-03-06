const connection = require("../connection");

/* Check if room exists in db with given room name. if exists, return error. Else create new room with credentials */
const createRoom = (uuid, roomName, roomType, host) => {
  let newRoom = null;
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT * FROM rooms WHERE roomName=?",
      [roomName],
      (error, results, fields) => {
        if (results.length > 0) {
          resolve(newRoom);
        } else {
          let sql =
            "INSERT INTO rooms (uuid, roomName, roomType, host) VALUES (?, ?, ?, ?)";
          newRoom = { uuid, roomName, roomType, host };
          connection.query(
            sql,
            [uuid, roomName, roomType, host],
            (error, results, fields) => {
              resolve(newRoom);
            }
          );
        }
      }
    );
  });
};

/* Get all rooms that a user has joined from DB*/
const getMyRooms = (username) => {
  return new Promise((resolve, reject) => {
    let query =
      "SELECT * FROM joined as p, rooms as c WHERE p.username=? AND c.uuid=p.room_uuid";
    connection.query(query, [username], (error, results, field) => {
      resolve(results);
    });
  });
};

/* get All rooms */
const getAllRooms = () => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * from rooms";
    connection.query(query, [], (error, results, field) => {
      resolve(results);
    });
  });
};

/* Join a user into a new room, insert into DB the room uuid and username*/
const joinRoom = (room_uuid, username) => {
  return new Promise((resolve, reject, error) => {
    let sql = "INSERT INTO joined (room_uuid, username) VALUES (?, ?)";
    connection.query(sql, [room_uuid, username], (error, results, fields) => {
      if (error) reject("Error in join room");
      resolve("Joined Successfully");
    });
  });
};

/* Get all public rooms from database */
const getPublicRooms = () => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM rooms WHERE roomType=?";
    connection.query(query, ["public"], (error, results, field) => {
      resolve(results);
    });
  });
};

/* Leave room */
const leaveRoom = (room_uuid, username) => {
  return new Promise((resolve, reject) => {
    let query = "DELETE FROM joined WHERE room_uuid=? AND username = ?";
    connection.query(query, [room_uuid, username], (error, results, field) => {
      if (error) reject("Error in leave room");

      resolve("Successfully left room");
    });
  });
};

/* DLETE ROOM */
const deleteRoom = (room_uuid) => {
  return new Promise((resolve, reject) => {
    let query = "DELETE FROM rooms WHERE uuid = ?";
    connection.query(query, [room_uuid], (error, results, field) => {
      if (error) reject("Error in delete room");
      resolve("Successfully deleted room");
    });
  });
};
module.exports.createRoom = createRoom;
module.exports.joinRoom = joinRoom;
module.exports.getMyRooms = getMyRooms;
module.exports.getPublicRooms = getPublicRooms;
module.exports.leaveRoom = leaveRoom;
module.exports.getAllRooms = getAllRooms;
module.exports.deleteRoom = deleteRoom;

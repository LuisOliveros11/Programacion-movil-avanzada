import Realm from "realm";

class Photo extends Realm.Object {
  static schema = {
    name: "Photo",
    properties: {
      id: "int", 
      uri: "string",
      name: "string", 
      location: "string", 
    },
    primaryKey: "id",
  };
}

const realmConfig = {
  schema: [Photo],
  schemaVersion: 1, 
};

export const getRealm = async () => {
  return await Realm.open(realmConfig);
};

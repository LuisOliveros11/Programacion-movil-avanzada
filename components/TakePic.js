import React, { useState, useEffect, useContext } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { RealmContext } from "./RealmProvider";

const TakePic = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [ip, setIp] = useState("Cargando...");
  const [photos, setPhotos] = useState([]);

  const realm = useContext(RealmContext);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permiso de ubicación denegado");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  useEffect(() => {
    fetch("https://api64.ipify.org?format=json")
      .then((response) => response.json())
      .then((data) => setIp(data.ip))
      .catch(() => setIp("No disponible"));
  }, []);

  useEffect(() => {
    const loadPhotos = () => {
      const storedPhotos = realm.objects("Photo");
      setPhotos([...storedPhotos]);
    };

    // Añadir un listener para actualizar la lista cuando cambien las fotos en Realm
    const photosInRealm = realm.objects("Photo");
    photosInRealm.addListener(() => {
      loadPhotos();
    });

    loadPhotos();

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      photosInRealm.removeListener(() => {
        loadPhotos();
      });
    };
  }, [realm]);

  const savePhotoToRealm = async (newPhoto) => {
    realm.write(() => {
      const photosInRealm = realm.objects("Photo");
      const maxId = photosInRealm.length > 0 ? photosInRealm.max("id") : 0;
      const newId = maxId + 1;
      realm.create("Photo", {
        id: newId,
        uri: newPhoto.uri,
        name: newPhoto.fileName,
        location: newPhoto.location
          ? `${newPhoto.location.latitude},${newPhoto.location.longitude}`
          : "",
      });
    });

    loadPhotos();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImage(asset.uri);

      const fileName = asset.uri.split("/").pop();

      const newPhoto = {
        uri: asset.uri,
        fileName,
        location: location ? { ...location } : null,
      };

      await savePhotoToRealm(newPhoto);
    }
  };


  const renderPhotoItem = ({ item }) => {
    let parsedLocation = null;

    if (item.location) {
      try {
        const locationArray = item.location.split(",");
        if (locationArray.length === 2) {
          parsedLocation = {
            latitude: parseFloat(locationArray[0]),
            longitude: parseFloat(locationArray[1]),
          };
        }
      } catch (error) {
        console.error("Error al analizar la ubicación:", error);
      }
    }

    return (
      <View style={styles.photoItem}>
        <Text style={styles.photoText}>Nombre: {item.name}</Text>
        <Text style={styles.photoText}>Ubicación: {parsedLocation ? `Lat: ${parsedLocation.latitude}, Lon: ${parsedLocation.longitude}` : "No disponible"}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Tomar Foto" onPress={pickImage} />
      <Text style={styles.listTitle}>Fotos tomadas:</Text>
      <FlatList
        data={photos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPhotoItem}
        style={styles.list}
      />
    </View>
  );
};

export default TakePic;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 20,
  },
  listTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
  },
  list: {
    width: "90%",
    marginTop: 10,
  },
  photoItem: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  photoText: {
    fontSize: 14,
  },
});

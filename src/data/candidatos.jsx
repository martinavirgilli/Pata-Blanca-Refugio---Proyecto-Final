import candidato1Img from "../assets/images/candidato1.jpg";
import candidato2Img from "../assets/images/candidato8.jpg";
import candidato3Img from "../assets/images/candidato9.jpg";

export const candidatosIniciales = [
  {
    id: 1,
    nombre: "Luna",
    especie: "Perro",
    edad: 3,
    descripcion: "Docil, se lleva bien con niños y otros perros.",
    imagen: candidato1Img, 
    adoptado: false,
  },
  {
    id: 2,
    nombre: "Ramon",
    especie: "Gato",
    edad: 2,
    descripcion: "Curioso y vago.",
    imagen: candidato2Img,
    adoptado: false,
  },
  {
    id: 3,
    nombre: "Coki",
    especie: "Conejo",
    edad: 1,
    descripcion: "Tranquilo y muy limpio.",
    imagen: candidato3Img,
    adoptado: false,
  }
];

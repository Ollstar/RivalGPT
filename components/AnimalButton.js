import React from "react";
import styles from './AnimalButton.module.css'


const AnimalButton = ({ animal, onClick }) => {
  return (
    <button className={styles.animalButton} onClick={() => onClick(animal)}>
      {animal}
    </button>
  );
};

export default AnimalButton;

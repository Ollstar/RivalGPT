import React from 'react';
import styles from './Message.module.css';

const Message = ({ author, text, timestamp }) => (
  <div className={author === 'User' ? styles.animalLeft : styles.animalRight}>
    {text}
      <div className={styles.subtext}>
      {timestamp ?"N:OW" : timestamp} - {author}
      </div>

  </div>
);

export default Message;

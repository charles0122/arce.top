import React, { useState } from "react";
import styles from "./style.module.css";
// import backgroundPng from "./background.png";
// import CodeBlock from "@theme/CodeBlock";
import Link from "@docusaurus/Link";
import Image from '@theme/IdealImage';

function BookCard({book,to}) {
    return (
        <Link to={to} className={styles.noteCard}>
            <div className={styles.bookCover}>
                <Image className={styles.bookImg} img={
                    book.cover}></Image>
            </div>
        </Link>
    );
}


export default BookCard;

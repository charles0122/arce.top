import React from "react";
import styles from "./style.module.css";
import Link from "@docusaurus/Link";

function BookCard({book,to}) {
    return (
        <Link to={to} className={styles.noteCard}>
            <div className={styles.bookCover}>
                <span className={styles.bookImg}>
                    <img
                        src={book.cover}
                        alt=""
                        loading="lazy"
                        decoding="async"
                    />
                </span>
            </div>
        </Link>
    );
}


export default BookCard;

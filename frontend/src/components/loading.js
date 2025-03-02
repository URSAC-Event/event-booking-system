import React, { useEffect } from 'react';
import BarLoader from "react-spinners/BarLoader";
import styles from './loading.module.css';

const Loading = ({ loading }) => {

    useEffect(() => {
        if (loading) {
            document.body.style.overflow = "hidden"; // Prevent scrolling
        } else {
            document.body.style.overflow = "auto"; // Restore scrolling
        }
        return () => {
            document.body.style.overflow = "auto"; // Cleanup when component unmounts
        };
    }, [loading]);

    if (!loading) return null; // Don't render if not loading

    return (
        <div className={styles.backdrop}>
            <div className={styles.loadingCont}>
                <p>Processing. Please wait.</p>
                <BarLoader
                    color="#ffffff"
                    cssOverride={{ borderRadius: '8px' }}
                    height={8}
                    loading
                    width={280}
                />
            </div>
        </div>
    );
}

export default Loading;

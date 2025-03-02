import React, { useEffect } from 'react';
import HashLoader from "react-spinners/HashLoader";
import styles from './SiteLoading.module.css';

const Siteloading = ({ loading }) => {
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
        <div>
            <div className={styles.backdrop}>
                <div className={styles.loadingCont}>
                    <HashLoader
                        color="#0e4296"
                        // cssOverride={{ borderRadius: '8px' }}
                        size={50}
                        loading
                    />
                    <div>
                        <p>Starting up the server…</p>
                        <p>Please wait a moment.</p>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Siteloading

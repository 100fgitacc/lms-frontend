import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
// import LangSelector from 'components/lang-selector';
// import AuthFooter from 'components/auth-footer';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const SignupPage = () => {
    const navigate = useNavigate();


    const handleLogin = (page) => {
        MySwal.fire({
            title: 'Authorization',
            html: `<input type="password" id="password" class="swal2-input" placeholder="password">`,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Login',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const password = document.getElementById('password').value;
                if (!password) {
                    Swal.showValidationMessage('Enter password');
                    return false;
                }
                return { password };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                const validPassword = process.env.REACT_APP_PASSWORD;

                if (result.value.password === validPassword) {
                    localStorage.setItem('auth', 'true'); 
                    Swal.fire('Success', 'You are loggining', 'success').then(() => {
                        navigate(page === 'project' ? '/project' : '/investor');
                    });
                } else {
                    MySwal.fire({
                        title: 'Error',
                        text: 'Incorrect password',
                        icon: 'error',
                        confirmButtonText: 'again'
                    }).then(() => handleLogin(page));
                }
            }
        });
    };

    return (
        <div className='auth-template'>
            <div className={`${styles['left-side']} left-side`}>
                <div className={styles.inner}>
                    <div className='auth-logo'>
                        <img src='../assets/img/logo-new-2.png' alt='logo'/>
                    </div>
                    <h1 className={`${styles.title} main-title`}>LOG IN
                        <br/><span> TO START</span></h1>
                  
                </div>
            </div>
            <div className={`${styles['right-side']} right-side`}>
                <div className={styles.inner}>
                    {/* <LangSelector/> */}
                    <div className={styles.content}>
                        <div className={`${styles.card} auth-card`}>
                            <div className={styles.desc}>
                                <p>Download the project</p>
                                <button className='auth-btn' onClick={() => handleLogin('project')}>Log In</button>
                            </div>
                            <div className={styles.image}>
                                <img src='../assets/img/project-management.png' alt='franklin image'/>
                            </div>
                        </div>
                        <div className={`${styles.card} auth-card`}>
                            <div className={styles.desc}>
                                <p>Become an investor</p>
                                <button className='auth-btn' onClick={() => handleLogin('investor')}>Log In</button>
                            </div>
                            <div className={styles.image}>
                                <img src='../assets/img/investor.png' alt='franklin image'/>
                            </div>
                        </div>
                    </div>
                    {/* <AuthFooter/> */}
                </div>
            </div>
        </div>
    );
};

export default SignupPage;

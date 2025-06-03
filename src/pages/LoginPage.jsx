import { useNavigate, matchPath } from "react-router-dom"
import styles from './login.module.css';
// import LangSelector from 'components/lang-selector';
// import AuthFooter from 'components/auth-footer';

const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
}



const LoginPage = () => {  
    
    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login');
    };

    return (
        <div className='auth-template'>
            <div className={`${styles['left-side']} left-side`}>
                <div className={styles.inner}>
                    <div className='auth-logo'>
                        <img src='../assets/img/logo-new-2.png' alt='logo'/>
                    </div>
                    <h1 className={`${styles.title} main-title`}>LOG IN<br/><span> TO START</span></h1>
                </div>
            </div>
            <div className={`${styles['right-side']} right-side`}>
                <div className={styles.inner}>
                    {/* <LangSelector/> */}
                    <div className={styles.content}>
                        {/* <div className={`${styles.card} auth-card`}>
                            <div className={styles.desc}>
                                <p>Download the project</p>
                                <button className='auth-btn' onClick={() => handleLogin('project')}>Log In</button>
                            </div>
                            <div className={styles.image}>
                                <img src='../assets/img/project-management.png' alt='franklin image'/>
                            </div>
                        </div> */}
                        <div className={`${styles.card} auth-card`}>
                            <div className={styles.desc}>
                                <p>Become a member</p>
                                <button className='auth-btn' onClick={() => handleLogin()}>Log In</button>
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

export default LoginPage;

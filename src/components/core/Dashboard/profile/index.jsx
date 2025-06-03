import React, { useState } from 'react';
import ContentHeader from '../content-header';
import PagePagination from '../../page-pagination';
import ProfileContent from './ProfileContent';

const Profile = () => {

    const [content, setContent] = useState('Account');
    const [currPage, setCurrPage] = useState('Profile');
    const handleSetContent = (e) => {
        setContent(e);
    }

    
    return (
        <>
            <ContentHeader page={content}/>
            {/* <PagePagination currPage={currPage} renderPageContent={handleSetContent}/> */}
            <ProfileContent content={content}/>
        </>
    );
};

export default Profile;

import { useEffect } from "react"
import { RiEditBoxLine } from "react-icons/ri"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../common/IconBtn"
import Img from './../../common/Img';

import ContentHeader from './content-header';
import PagePagination from '../page-pagination';
import ProfileContent from './profile';


export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate();


  // Scroll to the top of the page when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])
  const [content, setContent] = useState('Account');
  
  const handleSetContent = (e) => {
      setContent(e);
  }
  return (
    <>
      <ContentHeader page={content}/>
      {/* <PagePagination currPage={currPage} renderPageContent={handleSetContent}/> */}
      <ProfileContent content={content}/>
    </>
  )
}
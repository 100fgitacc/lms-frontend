
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"
import Img from '../../common/Img';


function Template({ title, description1, description2, image, formType }) {
  // const { loading } = useSelector((state) => state.auth);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-blue-800 mt-[75px]">
      <div className="mx-auto mt-10 flex w-11/12 max-w-maxContent flex-col-reverse justify-center items-center gap-y-12  md:gap-y-0 md:gap-x-12">
        <div className="mx-auto w-11/12 max-w-[450px] md:mx-0">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-white">
            {title}
          </h1>
          <p className="mt-4 text-[1.125rem] leading-[1.625rem] font-thin">
            <span className="">{description1}</span>{" "}
            <span className="font-edu-sa text-blue-100">
              {description2}
            </span>
          </p>

          {formType === "signup" ? <SignupForm /> : <LoginForm />}
        </div>
        <div className="relative  md:mx-0 my-0">
          <Img
            src={image}
            alt={formType}
            className={'w-[400px] text-white mb-[50px]'}
          />
        </div>
      </div>
    </div>
  )
}

export default Template